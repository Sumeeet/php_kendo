const RegisterValidate = (vm) => {
    const controlIdValidatorMap = new Map();
    const u = CT.Utils;

    function doValidate(validate) {
        return function(...value) {
            this.error = validate.call(this, ...value)
            return this;
        }
    }

    const recordErrors = (response) => {
        if (!Array.isArray(response)) return;

        response.forEach(res => {
            vm.updateErrorStatus(res);
            // TODO: may be not the best way to show errors in GUI here
            const errElement = getElement(res.erId);
            errElement.innerText = res.error.message;
        })
        return vm.getErrorStatus()
    }

    /**
     * run all validations or specific related to changed control id
     * @param id
     * @returns {Promise<void>}
     */
    const runValidations = (id = null) => {
        const validateFunctions = id === null ? Array.from(controlIdValidatorMap.values()) : [controlIdValidatorMap.get(id)];
        const awaitFunc = validateFunctions.map(val => {
            const element = getElement(val.id);
            return val.validateFunc(element.value)
        });
        return Promise.all(awaitFunc)
        .then((response) => recordErrors(response))
        .catch(e => console.log(`There has been a problem with validate function(s) : ${e.message}`))
    }

    const runValidation = (id, value) => {
        const validateFunctions = [controlIdValidatorMap.get(id)];
        const awaitFunc = validateFunctions.map(val => {
            return val.validateFunc(value)
        });
        return Promise.all(awaitFunc)
        .then((response) => recordErrors(response))
        .catch(e => console.log(`There has been a problem with validate function(s) : ${e.message}`))
    }

    const registerValidator = (id, erId, fns) => {
        // TODO: better way to transform and take care of boundary cases
        const first = fns.pop();
        let composedFns = fns.map(fn => u.chain(fn));
        composedFns.push(first);
        composedFns.splice(0, 0, u.either(u.identity, u.identity))

        const validateFunc = doValidate(u.compose(...composedFns));
        if (!controlIdValidatorMap.has(id)) {
            controlIdValidatorMap.set(id, { validateFunc: validateFunc, error: { }, id: id, erId : erId });
        }
    }

    return { registerValidator, runValidations, runValidation}
}