'use strict'

const getElement = id => document.getElementById(id)

const mainView = getElement('mainViewId')
const footerView = getElement('footer')

const error1 = getElement('errorId1')
const error2 = getElement('errorId2')
const error3 = getElement('errorId3')
const error4 = getElement('errorId4')

const Controller = function (viewModel) {
    const v = CT.Validations;

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

    (function() {
        viewModel.registerValidations('age.value',
            [
                v.isInRange(viewModel.get('age.min'), viewModel.get('age.max')),
                v.isPositive, v.isNumber], updateError);

        viewModel.registerValidations('height.value',
            [
                v.isInRange(viewModel.get('height.min'),
                    viewModel.get('height.max')),
                v.isPositive, v.isNumber], updateError);

        viewModel.registerValidations('weight.value',
            [
                v.isInRange(viewModel.get('weight.min'),
                    viewModel.get('weight.max')),
                v.isPositive, v.isNumber], updateError);

        // This is calculated field, so limits are defined manually, but
        // it can be pulled from other source too.
        viewModel.registerValidations('bmi', [
            v.isInRange(12, 42),
            v.isPositive, v.isNumber], updateError);

        bindDependencies(viewModel)
    })()
}