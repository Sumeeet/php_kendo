'use strict'

const getElement = id => document.getElementById(id)

const mainView = getElement('mainViewId')
const footerView = getElement('footer')
const loadButton = getElement('load')
const applyButton = getElement('apply')
const cacheButton = getElement('cache')

const error1 = getElement('errorId1')
const error2 = getElement('errorId2')
const error3 = getElement('errorId3')
const error4 = getElement('errorId4')

const url = "./Modules/Module1/test.json";
const limits_url = "./Modules/Module1/valueProperties.json";

function addListeners() {
    const v = CT.Validations;

    //caches.delete('CT_cache');
    // Initialize ViewModel with data requested at given url
    const viewModel = ViewModel(url);
    viewModel.init([limits_url])
    .then(result => {
        viewModel.bind(result, mainView, footerView);

        viewModel.registerValidations('age.value',
            [v.isInRange(viewModel.get('age.min'), viewModel.get('age.max')),
                v.isPositive, v.isNumber], updateError);

        viewModel.registerValidations('height.value',
            [v.isInRange(viewModel.get('height.min'), viewModel.get('height.max')),
                v.isPositive, v.isNumber], updateError);

        viewModel.registerValidations('weight.value',
            [v.isInRange(viewModel.get('weight.min'), viewModel.get('weight.max')),
                v.isPositive, v.isNumber], updateError);

        // This is calculated field, so limits are defined manually, but
        // it can be pulled from other source too.
        viewModel.registerValidations('bmi', [v.isInRange(12, 42),
                v.isPositive, v.isNumber], updateError);

        bindDependencies(viewModel)

        // run validations first time
        //viewModel.runValidations()
    })
    .catch(e => console.log(`There has been a problem with reading the source : ${e.message}`))

    loadButton.addEventListener('click', (event) => {
        event.stopPropagation();
        DataProxy().getData(url).then(response => console.log(response));
    }, false);

    applyButton.addEventListener('click', (event) => {
        event.stopPropagation();
        viewModel.getChangedModel()
        .then(response => DataProxy().postData(url, { method: 'POST', body: JSON.stringify(response) }))
        .then(result => {
            viewModel.reset();
        });
    })

    cacheButton.addEventListener('click', (event) => {
        event.stopPropagation();
        caches.delete('ct_cache')
    })
}

function bindDependencies (viewModel) {
    let bmiMapper = BmiMapper()

    // update bmi value when height or weight is changed
    viewModel.set('bmi',function() {
        return bmiMapper.CalculateBmi(this.get('weight.value'), this.get('height.value'))
    })

    // initialize bmi grid
    const dataSource = { dataSource: { data: {}}, columns: {}, width: 1500, height: 830 }
    dataSource.dataSource.data = bmiMapper.getBmiGridData()
    // dataSource.columns = bmiMapper.getBmiColumnInfo()
    $('#gridId').kendoGrid(dataSource)
}

function updateError(prop, message) {
    if (prop === 'age.value') error1.innerText = message
    else if(prop === 'height.value') error2.innerText = message
    else if(prop === 'weight.value') error3.innerText = message
    else if(prop === 'bmi') error4.innerText = message
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') addListeners()
}
