'use strict'

const getElement = id => document.getElementById(id)

const mainView = getElement('mainViewId')
const footerView = getElement('footer')
const loadButton = getElement('load')
const applyButton = getElement('apply')
const cacheButton = getElement('cache')
const ageEdit = getElement('ageId')
const heightEdit = getElement('heightId')
const weightEdit = getElement('weightId')
const bmiEdit = getElement('bmiId')

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

        registerValidate.registerValidator('ageId', 'errorId1',
            [v.isInRange(result['age'].min, result['age'].max),
                v.isPositive, v.isNumber]);

        registerValidate.registerValidator('heightId', 'errorId2',
            [v.isInRange(result['height'].min, result['height'].max),
                v.isPositive, v.isNumber]);

        registerValidate.registerValidator('weightId', 'errorId3',
            [v.isInRange(result['weight'].min, result['weight'].max),
                v.isPositive, v.isNumber]);

        // This is calculated field, so limits are defined manually, but
        // it can be pulled from other source too.
        registerValidate.registerValidator('bmiId', 'errorId4',
            [v.isInRange(12, 42), v.isPositive, v.isNumber]);

        // it's important to bind any custom dependencies before running any validations
        bindDependencies()

        // run validations first time
        registerValidate.runValidations()
        .then(response => console.log(`# Errors found on initial page load: ${response}`));
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

    ageEdit.addEventListener('keyup', (event) => {
        debounce(event);
    })

    heightEdit.addEventListener('keyup', (event) => {
        debounce(event);
    })

    weightEdit.addEventListener('keyup', (event) => {
        debounce(event);
    })

    bmiEdit.addEventListener('keyup', (event) => {
        debounce(event);
    })
}

function runValidations(event) {
    event.stopPropagation();
    registerValidate.runValidations(event.target.id);
}

function bindDependencies () {
    let bmiMapper = BmiMapper()

    // update bmi value when height or weight is changed
    viewModel.setValue('bmi',
        function () {
        const bimValue = bmiMapper.CalculateBmi(this.get('weight.value'), this.get('height.value'));
        registerValidate.runValidation('bmiId', bimValue);
        return bimValue;
    })

    // initialize bmi grid
    const dataSource = { dataSource: { data: {}}, columns: {}, width: 1500, height: 850 }
    dataSource.dataSource.data = bmiMapper.getBmiGridData()
    // dataSource.columns = bmiMapper.getBmiColumnInfo()
    $('#gridId').kendoGrid(dataSource)
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') addListeners()
}
