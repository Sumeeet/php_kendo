const RegisterValidate = (vm) => {
    const controlIdValidatorMap = new Map();

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
        .then((response) => {
            recordErrors(response);
        })
        .catch(e => console.log(`There has been a problem with validate function(s) : ${e.message}`))
    }

    const registerValidator = (id, erId, fn) => {
        if (!controlIdValidatorMap.has(id)) {
            controlIdValidatorMap.set(id, { validateFunc: fn, error: { }, id: id, erId : erId });
        }
    }

    const recordErrors = (response) => {
        if (!Array.isArray(response)) return;

        response.forEach(res => {
            vm.updateErrorStatus(res);
            const errElement = getElement(res.erId);
            errElement.innerText = res.error.message;
        })
    }

    return { registerValidator, runValidations }
}