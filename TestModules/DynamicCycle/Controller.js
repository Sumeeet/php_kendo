'use strict'

const getElement = id => document.getElementById(id)

const adjView = getElement('dynamicCycleViewId')
const footerView = getElement('footerId')
const loadButton = getElement('load')
const applyButton = getElement('apply')
const cacheButton = getElement('cache')
const input1 = getElement('input_field_id_1')

//const input = getElement('input_field_id');
const url = "./TestModules/DynamicCycle/test.json";

let viewModel;

function addListeners() {
    // Initialize ViewModel with data requested at given url
    viewModel = ViewModel(url, adjView, footerView);

    const preProcessStr = CT.Utils.compose((str) => str.split('|'), (str) => str.replaceAll(' ', ''));
    const funcCompose = CT.Utils.compose((orgValue, value, property) => {
        const orgArray = preProcessStr(orgValue);
        const array = preProcessStr(value);
        return CT.ValuePredicates.isArrayEqual(orgArray, array, property);
    })
    viewModel.setPropertyType('sLimits', funcCompose);
    viewModel.setPropertyType('sMoniParamList', funcCompose);
    viewModel.setPropertyType('storageSelectionMeasure', CT.ValuePredicates.isArrayEqual);

    loadButton.addEventListener('click', (event) => {
        event.stopPropagation();
        DataProxy().getData(url).then(response => console.log(response));
    }, false);

    applyButton.addEventListener('click', (event) => {
        event.stopPropagation();
        DataProxy().postData(url, {method: 'POST', body: JSON.stringify(viewModel)})
        .then(result => {
            viewModel.resetPropertyMap();
            viewModel.setChanged(false);
        });
    })

    cacheButton.addEventListener('click', (event) => {
        event.stopPropagation();
        caches.delete('CT_cache')
    })

    const validate = CT.Decorators.debounce(replaceAll, 200);
    input1.addEventListener('keyup', (event) => {
        event.stopPropagation();
        validate(input1.value)
    })

    function replaceAll(str) {
        // input1.value = str.replaceAll(' ', '')
        console.log('debounced');
    }
}

document.onreadystatechange = () => { if (document.readyState === 'complete') addListeners() }
