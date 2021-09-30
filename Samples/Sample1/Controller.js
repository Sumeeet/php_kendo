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

    //caches.delete('CT_cache');
    // Initialize ViewModel with data requested at given url
    viewModel = ViewModel(url, mainView, footerView);
    viewModel.init()
    .then(result => {
        registerValidate = RegisterValidate(viewModel);
        registerValidate.registerValidator('Num1Id', 'errorId1', isPositive);
        registerValidate.registerValidator('Num2Id', 'errorId2', isPositive);
        registerValidate.registerValidator('StrId', 'errorId3', isString);
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

    const debounce = CT.Decorators.debounce(runValidations, 400);

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
        registerValidate.runValidations(event.target);
    }

    const minMax = v.isInRange(0, 40);
    const validations = u.compose(
        u.either(u.identity, u.identity),
        u.chain(minMax),
        u.chain(v.isPositive),
        v.isNumber);

    function isPositive() {
        return CT.Utils.sleep(100)
        .then(result => {
            const element = getElement(this.id);
            const res = validations(element.value);
            const errElement = getElement(this.erId);
            errElement.innerText = res.message;
            res['srcId'] = this.id;
            return res;
        });
    }

    const strValidations = u.compose(
        u.either(u.identity, u.identity),
        v.isString);

    function isString() {
        const element = getElement(this.id);
        const res = strValidations(element.value);
        const errElement = getElement(this.erId);
        errElement.innerText = res.message;
        res['srcId'] = this.id;
        return res;
    }

    // const asyncValidate = CT.Decorators.makeAsync(validations);
    // function positive2() {
    //     return asyncValidate(num2Edit.value)
    //     .then(result => {
    //         const errElement = getElement(this.erId);
    //         errElement.innerText = validations(result)
    //     });
    // }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') addListeners()
}
