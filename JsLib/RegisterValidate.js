const RegisterValidate = (vm) => {
    const viewModel = vm;
    const controlIdValidatorMap = new Map();

    /**
     * run all validations or specific related to changed control id
     * @param cid control id
     */
    const runValidations = () => {
        const awaitFunc = Array.from(controlIdValidatorMap.values()).map(val => val.validateFn());
        return Promise.all(awaitFunc)
        .then((response) => {
            const pass = response.some(res => !res.pass)
            vm.setModelState(pass);
        })
        .catch(e => console.log(`There has been a problem with validate function(s) : ${e.message}`))
    }

    const registerValidator = (id, erId, fn) => {
        if (!controlIdValidatorMap.has(id)) {
            controlIdValidatorMap.set(id, { validateFn: fn, error: false, id: id, erId : erId });
        }
    }

    return {registerValidator, runValidations}
}