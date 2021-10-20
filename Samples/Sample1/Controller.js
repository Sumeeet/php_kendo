'use strict'

const getElement = id => document.getElementById(id)

const mainView = getElement('mainViewId')
const footerView = getElement('footer')
const loadButton = getElement('load')
const applyButton = getElement('apply')
const cacheButton = getElement('cache')
const num1Edit = getElement('Num1Id')
const num2Edit = getElement('Num2Id')
const strEdit = getElement('StrId')

const url = "./Samples/Sample1/test.json";

let viewModel;
let registerValidate;

function addListeners() {
    const v = CT.Validations;
    const u = CT.Utils;
    const minMax = v.isInRange(0, 40);
    const debounce = CT.Decorators.debounce(runValidations, 400);

    //caches.delete('CT_cache');
    // Initialize ViewModel with data requested at given url
    viewModel = ViewModel(url, mainView, footerView);
    viewModel.init()
    .then(result => {
        // the controllers
        registerValidate = RegisterValidate(viewModel);
        registerValidate.registerValidator('Num1Id', 'errorId1', [minMax, v.isPositive, v.isNumber]);
        registerValidate.registerValidator('Num2Id', 'errorId2', [minMax, v.isPositive, v.isNumber]);
        registerValidate.registerValidator('StrId', 'errorId3', [v.isNull]);
        // run validations first time
        registerValidate.runValidations();
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
        });
    })

    cacheButton.addEventListener('click', (event) => {
        event.stopPropagation();
        caches.delete('ct_cache')
    })

    num1Edit.addEventListener('keyup', (event) => {
        debounce(event);
    })

    num2Edit.addEventListener('keyup', (event) => {
        debounce(event);
    })

    strEdit.addEventListener('keyup', (event) => {
        debounce(event);
    })

    function runValidations(event) {
        event.stopPropagation();
        registerValidate.runValidations(event.target.id);
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') addListeners()
}
