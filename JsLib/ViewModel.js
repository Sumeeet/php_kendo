'use strict';

const ViewModel = (url) => {
    const dataProxy = DataProxy('ct_cache');
    let observableObject = null;
    let changedObservableObject = null;

    // Pick the last property changed
    let lastPropChanged;

    // Absolute property path as key and comparison function as value
    // to compare last value and current value in HasChanged
    const propToCompareMap = new Map();

    // record property changes, that way only changed property are sent to
    // server
    const propChangedList = [];

    // record errors to keep apply button state in sync
    const errorMap = new Map();

    // how frequent a change in model properties is checked
    // any intermediate change within ms time is thrown away
    // and timer is reset again.
    const TIME_MS = 100;

    const recordPropertyChange = (event) => {
        // TODO: Dependent properties dont work well with path properties
        //const path = event[0].sender.path;
        const path = event[0].field
        propChangedList.push(path)
        lastPropChanged = path;
    }

    const getCompareFunc = (property) => {
        if (propToCompareMap.has(property)) return propToCompareMap.get(property);
        return CT.Validations.isStringEqual;
    }

    const getValueAtKey = (model, key) => {
        // check if key is an array, extract index and property
        // const index = key.indexOf('[');
        // const rIndex = key.lastIndexOf(']');
        // if (index > -1) {
        //     const property = key.substring(0, index);
        //     const aIndex = Number(key.substring(index + 1, rIndex));
        //     return model[`${property}`][`${aIndex}`];
        // }
        return model[key];
    }

    const getValue = (model) => (keys) => {
        let auxModel = getValueAtKey(model, keys[0]);
        const length = keys.length;
        for (let index = 1; index < length; ++index) {
            const key = keys[index];
            auxModel = auxModel[key];
        }
        return auxModel;
    }

    const hasChanged = (/*event*/) => {
        dataProxy.getData(url, {'method': 'GET'})
        .then(cachedModel => {
            const model = observableObject.toJSON();
            const getCachedValue = getValue(cachedModel);
            const getChangedValue = getValue(model);

            for (const propPath of propChangedList) {
                const properties = propPath.split('.');
                const cachedValue = getCachedValue(properties);
                const value = getChangedValue(properties);
                const compareFunc = getCompareFunc(propPath);
                try {
                    const compareValue = compareFunc(propPath, cachedValue);
                    const validations = CT.Utils.compose(
                        CT.Utils.either(CT.Utils.identity, CT.Utils.identity),
                        compareValue);

                    // TODO: need to have some state to remember value change when no errors
                    const result = validations(value);
                    if (!result.pass) {
                        changedObservableObject.set('changed', !(errorMap.size > 0))
                        console.log(result.message);
                    }
                }
                catch (e) {
                    console.log(`Undefined Value ${e}`)
                }
            }
        });
    }

    const mergeDependencies = (source, depends) => {
        return Promise.all(depends)
        .then(models => {
            // TODO: make merge generic
            const model = Object.assign({}, source);
            const dependentModel = models.pop();
            const keys = Object.keys(model);
            keys.forEach(key => {
                if (dependentModel.hasOwnProperty(key)) {
                    model[key].min = dependentModel[key].min;
                    model[key].max = dependentModel[key].max
                }
            });
            return model;
        })
    }

    /**
     * Load data from other source and merge with main model
     * @param dependencies
     * @returns {Promise<T | void>}
     */
    const init = (dependencies) => {
        const awaitFunc = dependencies.map(url => dataProxy.getData(url, {'method': 'GET'}))

        return dataProxy.getData(url, {'method': 'GET'})
        .then(model => mergeDependencies(model, awaitFunc))
        .then(model => {
            observableObject = kendo.observable(model);
            return model
        })
        .catch(e => console.log(`There has been a problem with reading the source : ${e.message}`))
    }

    /**
     *
     * @returns {PromiseLike<string> | Promise<string>}
     */
    const bind = (mainView, footerView) => {
        if (!observableObject) {
            throw 'Data is not fetched yet. Initialize ViewModel first';
        }

        kendo.bind(mainView, observableObject)

        // change events are not handled, this is only used for binding
        changedObservableObject = kendo.observable({ changed: false });
        kendo.bind(footerView, changedObservableObject);

        // register for property change event
        const debounce = CT.Decorators.debounce(hasChanged, TIME_MS, recordPropertyChange);
        observableObject.bind("change", (event) => { debounce(event); });
    }

    /**
     *
     */
    const reset = () => {
        propToCompareMap.clear();
        errorMap.clear();
        changedObservableObject.set('changed', false);
    }

    /**
     *
     * @param property absolute path of object property
     * @param predicate comparison function to compare 2 values
     * @returns {Map<any, any>}
     */
    const setPropertyType = (property, predicate) => propToCompareMap.set(property, predicate);

    /**
     *
     * @param err
     */
    const updateErrorStatus = (err) => {
        if (!err.error.pass) {
            errorMap.set(err.id, err);
            changedObservableObject.set('changed', false);
        } else {
            if (errorMap.has(err.id)) {
                errorMap.delete(err.id);
                changedObservableObject.set('changed', errorMap.size === 0);
            }
        }
    }

    /**
     *
     * @param prop
     * @param value
     * @returns {*}
     */
    const setValue = (prop, value) => observableObject.set(prop, value)

    /**
     *
     * @returns {number}
     */
    const getErrorStatus = () => errorMap.size

    /**
     *
     * @returns {Promise<T | void>}
     */
    const getChangedModel = () => {
        return dataProxy.getData(url, {'method': 'GET'})
        .then(model => {
            const changedModel = Object.assign({}, model)
            const observableModel = observableObject.toJSON();
            const getChangedValue = getValue(observableModel);

            // pick only what is changed
            for (const propPath of propChangedList) {
                const properties = propPath.split('.');
                const value = getChangedValue(properties);
                // TODO: get properties dynamically
                if (changedModel.hasOwnProperty(properties[0])) {
                    changedModel[properties[0]]['value'] = value
                }
            }
            return changedModel
        })
        .catch(e => console.log(`There has been a problem with reading the source : ${e.message}`))
    }

    return { init, bind, reset, setPropertyType, updateErrorStatus, setValue, getErrorStatus, getChangedModel }
}
