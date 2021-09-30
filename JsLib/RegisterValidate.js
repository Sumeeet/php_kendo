const RegisterValidate = (vm) => {
    const controlIdValidatorMap = new Map();

    /**
     * run all validations or specific related to changed control id
     * @param id
     * @returns {Promise<void>}
     */
    const runValidations = (id = null) => {
        const validateFunctions = id === null ? Array.from(controlIdValidatorMap.values()) : [controlIdValidatorMap.get(id)];
        const awaitFunc = validateFunctions.map(val => val.validateFunc());
        return Promise.all(awaitFunc)
        .then((response) => {
            recordErrors(response);
        })
        .catch(e => console.log(`There has been a problem with validate function(s) : ${e.message}`))
    }

    const registerValidator = (id, erId, fn) => {
        if (!controlIdValidatorMap.has(id)) {
            controlIdValidatorMap.set(id, { validateFunc: fn, error: false, id: id, erId : erId });
        }
    }

    const recordErrors = (errors) => {
        if (!Array.isArray(errors)) return;

        errors.forEach(error => {
            if (!error.pass) vm.recordError(error['srcId'], error);
            else vm.removeError(error['srcId']);
        })
    }

    return {registerValidator, runValidations}
}