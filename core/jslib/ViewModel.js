"use strict";

const ViewModel = function () {
  const dataProxy = DataProxy("ct_cache");
  let observableObject = null;
  let changedObservableObject = null;
  let sourceUrl = "";

  const controlIdValidatorMap = new Map();
  const u = CT.Utils;

  // record property changes, that way only changed property are sent to the server
  let propChangedList = [];

  // record errors to keep apply button state in sync
  const errorMap = new Map();

  // how frequent a change in model properties is checked
  // any intermediate change within ms time is thrown away
  // and timer is reset again.
  const TIME_MS = 100;

  const recordPropertyChange = function (event) {
    // TODO: Dependent properties dont work well with path properties
    //const path = event.sender.path;
    const path = event.field;

    const value = observableObject.get(path);
    if (
      !propChangedList.find((prop) => prop === path) &&
      typeof value !== "function"
    ) {
      propChangedList.push(path);
    }
  };

  const getValueAtKey = function (model, key) {
    // check if key is an array, extract index and property
    // const index = key.indexOf('[');
    // const rIndex = key.lastIndexOf(']');
    // if (index > -1) {
    //     const property = key.substring(0, index);
    //     const aIndex = Number(key.substring(index + 1, rIndex));
    //     return model[`${property}`][`${aIndex}`];
    // }
    return model[key];
  };

  const getPropValue = (model) => (keys) => {
    let auxModel = getValueAtKey(model, keys[0]);
    const length = keys.length;
    for (let index = 1; index < length; ++index) {
      const key = keys[index];
      auxModel = auxModel[key];
    }
    return auxModel;
  };

  const hasChanged = (event) => {
    dataProxy
      .getData(sourceUrl, { method: "GET" })
      .then(function (cachedModel) {
        const getCachedValue = getPropValue(cachedModel);
        const propPath = event.field;
        if (propPath) {
          const properties = propPath.split(".");
          const cachedValue = getCachedValue(properties);
          try {
            // TODO: need to have some state to remember value change when no errors
            runValidations(propPath)
              .then((response) => {
                // values of calculated fields not part of cached/original model
                //if (cachedValue !== undefined) {
                changedObservableObject.set("canchange", !(errorMap.size > 0));
                //}
              })
              .catch((e) =>
                Log(Message(MESSAGE_TYPE.error, "client", e.message).toString())
              );
          } catch (e) {
            Log(
              Message(
                MESSAGE_TYPE.error,
                "client",
                `Undefined Value ${e}`
              ).toString()
            );
          }
        }
      });
  };

  const doValidate = function (validateFunc) {
    return function (...value) {
      this.message = validateFunc.call(this, ...value);
      return this;
    };
  };

  const fetchFromCache = function (url) {
    return dataProxy
      .getData(url, { method: "GET" })
      .then((model) => model)
      .catch((e) =>
        Log(
          Message(
            MESSAGE_TYPE.error,
            "client",
            `There has been a problem with reading the source : ${e.message}`.toString()
          )
        )
      );
  };

  const revTransform = CT.Utils.curry((transformInfo, model) => {
    // this is where aux data is filled in and non-bindable data
    // is not part of observable. auxDataArray is of the form
    // {grid0Aux: [source, source2], grid1Aux: [source, source2] }
    // key must have "Aux" as a suffix in order to fetch data
    const transformAux = u.curry((source, transformObj) => {
      const bind = transformObj["bind"];
      const action = transformObj["apply"];
      const attribute = transformObj["attribute"];
      const auxData = observableObject.toJSON()[bind];
      // TODO: can we avoid sending attributes ?
      action(auxData, attribute, source);
    });

    return u.compose(
      () => model,
      u.forEach(u.chain(transformAux(model))),
      u.getSafeDataArray(/^\w+\d*Aux$/g)
    )(transformInfo);
  });

  const transform = CT.Utils.curry((transformInfo, model) => {
    // this is where aux data is filled in and non-bindable data
    // is not part of observable. auxDataArray is of the form
    // {grid0Aux: [source, source2], grid1Aux: [source, source2] }
    // key must have "Aux" as a suffix in order to fetch data
    const transformAux = u.curry((source, transformObj) => {
      const action = transformObj["init"];
      action(source);
    });

    return u.compose(
      () => model,
      u.forEach(u.chain(transformAux(model))),
      u.getSafeDataArray(/^\w+\d*Aux$/g)
    )(transformInfo);
  });

  const merge = CT.Utils.curry((depends, model) => {
    u.asyncCompose();
    const awaitFunc = depends.map((d) =>
      dataProxy.getData(d, { method: "GET" })
    );

    return Promise.all(awaitFunc).then((models) => {
      // TODO: make merge generic
      if (models.length === 0) return model;
      const modelCopy = Object.assign({}, model);
      const dependentModel = models.pop();
      const keys = Object.keys(modelCopy);
      keys.forEach((key) => {
        if (Object.hasOwn(dependentModel, key)) {
          modelCopy[key].min = dependentModel[key].min;
          modelCopy[key].max = dependentModel[key].max;
        }
      });
      return modelCopy;
    });
  });

  /**
   * Load data from other source and merge with main model
   * @returns {Promise<T | void>}
   */
  const init = function (url) {
    // member url is used in hasChanged function to get values from cache
    // url is used as a key
    sourceUrl = url;

    return fetchFromCache(url);
  };

  /**
   *
   * @param observableObject
   * @param mainView
   * @param footerView
   */
  const bind = u.curry((mainView, footerView, model) => {
    if (!model) {
      throw "Data is not fetched yet. Initialize ViewModel first";
    }

    observableObject = kendo.observable(model);
    kendo.bind(mainView, observableObject);

    // change events are not handled, this is only used for binding
    changedObservableObject = kendo.observable({
      cancache: true,
      canload: true,
      canchange: false,
    });
    kendo.bind(footerView, changedObservableObject);

    // register for property change event
    const debounce = CT.Decorators.debounce(
      hasChanged,
      TIME_MS,
      recordPropertyChange
    );
    observableObject.bind("change", function (event) {
      debounce(event);
    });
  });

  /**
   *
   */
  const reset = function () {
    errorMap.clear();
    propChangedList = [];
    changedObservableObject.set("canchange", false);
  };

  /**
   *
   * @param response
   */
  const updateErrorStatus = function (response) {
    const recordErrors = (prop, msg) => {
      const message = msg.toString();
      if (MESSAGE_TYPE.error === msg.type()) {
        errorMap.set(prop, message);
        changedObservableObject.set("canchange", false);
      } else {
        if (errorMap.has(prop)) {
          errorMap.delete(prop);
          changedObservableObject.set("canchange", errorMap.size === 0);
        }
      }
    };

    const message = response.message;
    const prop = response.prop;
    const messages = !Array.isArray(message) ? [message] : message;
    messages.forEach((msg) => recordErrors(prop, msg));
    return messages;
  };

  /**
   *
   * @param prop
   * @param value
   * @returns {*}
   */
  const set = function (prop, value) {
    try {
      if (u.isUndefined(value)) {
        // get it from the cache
        dataProxy.getData(url, { method: "GET" }).then(function (cachedModel) {
          const property = prop.split(".");
          const cachedValue = cachedModel[property[0]]["value"];
          observableObject.set(prop, cachedValue);
        });
      } else {
        observableObject.set(prop, value);
      }
    } catch (e) {
      Log(`Unable to set value ${value} for property ${prop} : ${e.message}`);
    }
  };

  /**
   *
   * @param prop
   * @returns {*}
   */
  const get = function (prop) {
    const value = observableObject.get(prop);
    return typeof value !== "function" ? value : value.call(observableObject);
  };

  /**
   *
   * @returns {Promise<T | void>}
   */
  const save = u.curry((url, model) => {
    DataProxy()
      .postData(url, {
        method: "POST",
        body: JSON.stringify(model),
      })
      .then((result) => {
        Log(Message(MESSAGE_TYPE.info, "server", "Data saved").toString());
        reset();
      })
      .catch((e) => Log(`Unable to save data : ${e.message}`));
  });

  const update = CT.Utils.curry((model) => {
    const changedModel = Object.assign({}, model);
    const observableModel = observableObject.toJSON();
    const getChangedValue = getPropValue(observableModel);

    // pick only what is changed
    for (const propPath of propChangedList) {
      const properties = propPath.split(".");
      const value = getChangedValue(properties);
      // TODO: get properties dynamically
      if (Object.hasOwn(changedModel, properties[0])) {
        changedModel[properties[0]] = value;
      }
    }
    return changedModel;
  });

  /**
   * run all validations or specific to a change event
   * @param prop
   * @returns {Promise<void>}
   */
  const runValidations = function (prop = null) {
    const propPaths =
      prop === null ? Array.from(controlIdValidatorMap.keys()) : [prop];
    const canValidate = (propPath) =>
      controlIdValidatorMap.get(propPath) !== undefined;
    // get all the validate functions related to grid i.e. more than one func and for other controls
    const getValidate = (propPath) =>
      controlIdValidatorMap
        .get(propPath)
        .map((vo) => vo.validateFunc(get(propPath)));
    const funcNotDefined = (propPath) => undefined;

    const awaitValidate = (funcToValidate) => {
      return Promise.all(funcToValidate)
        .then((response) =>
          u.forEach(
            u.compose(
              u.forEach((msg) => Log(msg.toString())),
              u.filter((msg) => msg.type() === MESSAGE_TYPE.error),
              updateErrorStatus
            )
          )(response)
        )
        .catch((e) =>
          Log(
            `There has been a problem with validate function(s) : ${e.message}`
          )
        );
    };

    const getValidateFunc = u.compose(
      u.IfElse(canValidate, getValidate, funcNotDefined)
    );

    const validate = u.compose(
      awaitValidate,
      u.filter((f) => f !== undefined),
      u.flatten, // flatten nested arrays
      u.chain(u.map(getValidateFunc)),
      Maybe.of
    );

    return validate(propPaths);
  };

  /**
   *
   * @param prop
   * @param fns
   */
  const registerValidations = function (prop, fns) {
    const composedFns = u.chainAndCompose(fns);
    const validateFunc = doValidate(composedFns);
    const validateObject = {
      validateFunc: validateFunc,
      message: {},
      prop: prop,
    };
    if (!controlIdValidatorMap.has(prop)) {
      controlIdValidatorMap.set(prop, [validateObject]);
    } else {
      // grid case, validations for all the columns will run even if it's
      // not really needed, currently there is no good way to find out a
      // change in particular column or cell while listening to a value change
      // This can be achieved using grid events.
      controlIdValidatorMap.get(prop).push(validateObject);
    }
  };

  return {
    init,
    bind,
    reset,
    set,
    get,
    registerValidations,
    runValidations,
    merge,
    transform,
    fetchFromCache,
    revTransform,
    update,
    save,
  };
};
