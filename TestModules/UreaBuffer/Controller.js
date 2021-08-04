'use strict'

const getElement = id => document.getElementById(id)

const ubView = getElement('ureaBufferId')
const footerView = getElement('footer')
const applyButton = getElement('apply')
const delayTimeT1 = getElement('InpDelayTimeT1')
const delayTimeT2 = getElement('InpDelayTimeT2')

const url = "./TestModules/UreaBuffer/test.json";

let viewModel;
let registerValidate;

function addListeners() {
    //caches.delete('CT_cache');
    const minMax = CT.Validations.isInRange(0, 40);
    // Initialize ViewModel with data requested at given url
    viewModel = ViewModel(url, ubView, footerView);
    viewModel.init()
    .then(result => {
        registerValidate = RegisterValidate(viewModel);
        registerValidate.registerValidator('InpDelayTimeT1', positive1);
        registerValidate.registerValidator('InpDelayTimeT2', positive2);
    })

    applyButton.addEventListener('click', (event) => {
        event.stopPropagation();
        DataProxy().postData(url, {method: 'POST', body: JSON.stringify(viewModel)})
        .then(result => {
            viewModel.reset();
            viewModel.setModelState(false);
        });
    })

    const validate = (value) => CT.Validations.isPositive(value) && minMax(value);
    const asyncValidate = CT.Decorators.makeAsync(validate);

    function positive1() {
        return CT.Utils.sleep(100)
        .then(result => validate(delayTimeT1.value))
        .then(result => result);
    }

    function positive2() {
        return asyncValidate(delayTimeT2.value)
        .then(result => result);
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') addListeners()
}
