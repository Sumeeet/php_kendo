const RegisterValidate = (vm) => {
    const viewModel = vm;
    const controlIdValidatorMap = new Map();
    // execute function as soon as possible
    const TIME_MS = 200;

    /**
     * run all validations or specific related to changed control id
     * @param cid control id
     */
    const runValidations = () => {
        const keys = controlIdValidatorMap.keys();
        const awaitFunc = [];
        for (const key of keys) {
            const validate = controlIdValidatorMap.get(key);
            awaitFunc.push(validate.validateFn());
        }

        return Promise.all(awaitFunc)
        .then((response) => {
            const error = response.some(res => !res.pass)
            vm.setModelState(error);
            //return response.map(res => res.getMessages());
            setTimeout(runValidations, TIME_MS);
        })
        .catch(e => console.log(`There has been a problem with validate function(s) : ${e.message}`))
    }

    (() => {
        setTimeout(runValidations, 0);
    })()

    const registerValidator = (id, fn) => {
        if (!controlIdValidatorMap.has(id)) {
            controlIdValidatorMap.set(id, { validateFn: fn, error: false });
        }
    }

    return {registerValidator, runValidations}
}