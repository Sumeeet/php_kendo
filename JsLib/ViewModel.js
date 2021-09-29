'use strict';

const ViewModel = (url, mainView, footerView) => {
    const dataProxy = DataProxy('ct_cache');
    let observableObject = {};
    let changedObservableObject = {};
    const propertyMap = new Map();
    const propertyType = new Map();
    const modelStates = Object.freeze({
        Error: 'Error',
        UnChanged: 'UnChanged',
        Validated: 'Validated',
    });

    let modelState = modelStates.UnChanged;

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
    }

    const init = () => {
        return dataProxy.getData(url, {'method': 'GET'})
        .then(model => {
            observableObject = kendo.observable(model);
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
            return 'success';
        })
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

            for (const key of propertyMap.keys()) {
                const property = propertyMap.get(key);
                const keys = key.split('.');
                const cachedValue = getCachedValue(keys);
                const value = getChangedValue(keys);
                const compareFunc = getCompareFunc(property);
                try {
                    const compareValue = compareFunc(property, cachedValue);
                    const validations = CT.Utils.compose(
                        CT.Utils.either(CT.Utils.identity, CT.Utils.identity),
                        compareValue);

                    const result = validations(value);
                    if (!result.pass) {
                        console.log(result.message);
                    }

                    switch (modelState) {
                        case modelStates.UnChanged:
                            changedObservableObject.set('changed', true);
                            modelState = modelStates.Validated;
                            break;
                        case modelStates.Validated:
                            changedObservableObject.set('changed', true);
                            break;
                    }
                }
                catch (e) {
                    console.log(`Undefined Value ${e}`)
                }
            }
        });
    }

    const reset = () => {
        propertyMap.clear();
        changedObservableObject.set('changed', false);
    }

    const setPropertyType = (property, predicate) => propertyType.set(property, predicate);

    const setModelState = (error) => {
        switch (modelState) {
            case modelStates.UnChanged:
                changedObservableObject.set('changed', false);
                if (error) {
                    modelState = modelStates.Error;
                }
                break;
            case modelStates.Validated:
                if (error) {
                    modelState = modelStates.Error;
                    changedObservableObject.set('changed', false);
                }
                break;
            case modelStates.Error:
                if (!error) {
                    changedObservableObject.set('changed', true);
                    modelState = modelStates.Validated;
                } else {
                    changedObservableObject.set('changed', false);
                }
                break;
            default:
                break;
        }
    }

    return { init, reset, setPropertyType, setModelState }
}
