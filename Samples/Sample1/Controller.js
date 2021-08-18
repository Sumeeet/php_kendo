'use strict'

const getElement = id => document.getElementById(id)

const mainView = getElement('mainViewId')
const footerView = getElement('footer')
const loadButton = getElement('load')
const applyButton = getElement('apply')
const cacheButton = getElement('cache')
const num1Edit = getElement('Num1Id')
const num2Edit = getElement('Num2Id')
const error1Span = getElement('errorId1')
const error2Span = getElement('errorId2')

const url = "./Samples/Sample1/test.json";

let viewModel;
let registerValidate;

function addListeners() {
    const v = CT.Validations;
    const u = CT.Utils;

    //caches.delete('CT_cache');
    // Initialize ViewModel with data requested at given url
    viewModel = ViewModel(url, mainView, footerView);
    viewModel.init()
    .then(result => {
        registerValidate = RegisterValidate(viewModel);
        registerValidate.registerValidator('Num1Id', positive1);
        registerValidate.registerValidator('Num2Id', positive2);
        registerValidate.runValidations()
        .then(result => {
            errorId1.innerText = result[0];
            errorId2.innerText = result[1];
        });
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

    const debounce = CT.Decorators.debounce(runValidations, 400);

    num1Edit.addEventListener('keyup', (event) => {
        debounce(event);
    })

    num2Edit.addEventListener('keyup', (event) => {
        debounce(event);
    })

    function runValidations(event) {
        event.stopPropagation();
        registerValidate.runValidations()
        .then(result => {
            errorId1.innerText = result[0];
            errorId2.innerText = result[1];
        });
    }

    const minMax = v.isInRange(0, 40);
    const validations = u.compose(
        u.either(u.identity, u.identity),
        u.chain(minMax),
        u.chain(v.isPositive),
        v.isNumber);

    function positive1() {
        return CT.Utils.sleep(100)
        .then(result => validations(num1Edit.value));
    }

    const asyncValidate = CT.Decorators.makeAsync(validations);
    function positive2() {
        return asyncValidate(num2Edit.value)
        .then(result => result);
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') addListeners()
}
