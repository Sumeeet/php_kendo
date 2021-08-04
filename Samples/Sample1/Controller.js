'use strict'

const getElement = id => document.getElementById(id)

const mainView = getElement('mainViewId')
const footerView = getElement('footer')
const loadButton = getElement('load')
const applyButton = getElement('apply')
const cacheButton = getElement('cache')
const num1Id = getElement('Num1Id')
const num2Id = getElement('Num2Id')

const url = "./Samples/Sample1/test.json";

let viewModel;
let registerValidate;

function addListeners() {
    //caches.delete('CT_cache');
    const minMax = CT.Validations.isInRange(0, 40);
    // Initialize ViewModel with data requested at given url
    viewModel = ViewModel(url, mainView, footerView);
    viewModel.init()
    .then(result => {
        registerValidate = RegisterValidate(viewModel);
        registerValidate.registerValidator('Num1Id', positive1);
        registerValidate.registerValidator('Num2Id', positive2);
    })

    loadButton.addEventListener('click', (event) => {
        event.stopPropagation();
        DataProxy().getData(url).then(response => console.log(response));
    }, false);

    applyButton.addEventListener('click', (event) => {
        event.stopPropagation();
        DataProxy().postData(url, {method: 'POST', body: JSON.stringify(viewModel)})
        .then(result => {
            viewModel.reset();
            viewModel.setModelState(false);
        });
    })

    cacheButton.addEventListener('click', (event) => {
        event.stopPropagation();
        caches.delete('ct_cache')
    })

    const validate = (value) => CT.Validations.isPositive(value) && minMax(value);
    const asyncValidate = CT.Decorators.makeAsync(validate);

    function positive1() {
        return CT.Utils.sleep(100)
        .then(result => validate(num1Id.value))
        .then(result => result);
    }

    function positive2() {
        return asyncValidate(num2Id.value)
        .then(result => result);
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') addListeners()
}
