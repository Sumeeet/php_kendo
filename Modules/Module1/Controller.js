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

const url = "./Modules/Module1/test.json";
const limits_url = "./Modules/Module1/valueProperties.json";

let viewModel;
let registerValidate;

function addListeners() {
    const v = CT.Validations;
    const debounce = CT.Decorators.debounce(runValidations, 400);

    //caches.delete('CT_cache');
    // Initialize ViewModel with data requested at given url
    viewModel = ViewModel(url);
    viewModel.init([limits_url])
    .then(result => {
        viewModel.bind(mainView, footerView);
        registerValidate = RegisterValidate(viewModel);
        registerValidate.registerValidator('Num1Id', 'errorId1',
            [v.isInRange(result['number1'].min, result['number1'].max),
                v.isPositive, v.isNumber]);

        registerValidate.registerValidator('Num2Id', 'errorId2',
            [v.isInRange(result['number2'].min, result['number2'].max), v.isNumber]);

        registerValidate.registerValidator('StrId', 'errorId3', [v.isNull]);
        // run validations first time
        registerValidate.runValidations();
    })
    .catch(e => console.log(`There has been a problem with reading the source : ${e.message}`))


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
