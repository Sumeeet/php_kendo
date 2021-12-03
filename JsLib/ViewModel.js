'use strict';

const ViewModel = (url) => {
    const dataProxy = DataProxy('ct_cache');
    let observableObject = {};
    let changedObservableObject = {};
    let initialized = false;

    // Pick the last property changed
    let lastPropChanged;

    const propertyMap = new Map();
    const propertyType = new Map();
    const errorMap = new Map();

    // how frequent a change in model properties is checked
    // any intermediate change within ms time is thrown away
    // and timer is reset again.
    const TIME_MS = 200;

    const recordPropertyChange = (event) => {
        const path = event[0].sender.path;
        const length = path.length;
        const rIndex = path.lastIndexOf('.');

        let key, value;
        if (rIndex === -1) {
            key = path.substring(0, length);
            value = key;
        } else {
            key = path.substring(0, length);
            value = path.substring(rIndex + 1, length);
        }

        if (!propertyMap.has(key)) {
            propertyMap.set(key, value);
        }

        // last changed property
        lastPropChanged = key;
    }

    const getCompareFunc = (property) => {
        if (propertyType.has(property)) return propertyType.get(property);
        return CT.Validations.isStringEqual;
    }

    const getValueAtKey = (model, key) => {
        // check if key is an array, extract index and property
        const index = key.indexOf('[');
        const rIndex = key.lastIndexOf(']');
        if (index > -1) {
            const property = key.substring(0, index);
            const aIndex = Number(key.substring(index + 1, rIndex));
            return model[`${property}`][`${aIndex}`];
        }
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

    const hasChanged = (event) => {
        dataProxy.getData(url, {'method': 'GET'})
        .then(cachedModel => {
            const model = observableObject.toJSON();
            const getCachedValue = getValue(cachedModel);
            const getChangedValue = getValue(model);

            //for (const key of propertyMap.keys()) {
            const property = propertyMap.get(lastPropChanged);
            const keys = lastPropChanged.split('.');
            const cachedValue = getCachedValue(keys);
            const value = getChangedValue(keys);
            const compareFunc = getCompareFunc(property);
            try {
                const compareValue = compareFunc(property, cachedValue);
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
            // }
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
            initialized = true;
            return model
        })
        .catch(e => console.log(`There has been a problem with reading the source : ${e.message}`))
    }

    /**
     *
     * @returns {PromiseLike<string> | Promise<string>}
     */
    const bind = (mainView, footerView) => {
        if (!initialized) {
            throw 'Data is not fetched yet. Initialize ViewMode first';
        }

        kendo.bind(mainView, observableObject)

        // change events are not handled, this is only used for binding
        changedObservableObject = kendo.observable({
            changed: false
        });
        kendo.bind(footerView, changedObservableObject);

        // register for property change event
        const debounce = CT.Decorators.debounce(hasChanged, TIME_MS, recordPropertyChange);
        observableObject.bind("change", (event) => {
            debounce(event);
        });
    }

    /**
     *
     */
    const reset = () => {
        propertyMap.clear();
        errorMap.clear();
        changedObservableObject.set('changed', false);
    }

    /**
     *
     * @param property
     * @param predicate
     * @returns {Map<any, any>}
     */
    const setPropertyType = (property, predicate) => propertyType.set(property, predicate);

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

    return { init, bind, reset, setPropertyType, updateErrorStatus }
}
