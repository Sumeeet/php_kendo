'use strict'

const ageEdit = getElement('ageId')
const heightEdit = getElement('heightId')
const weightEdit = getElement('weightId')

const BmiController = function (viewModel, history) {
    const v = CT.Validations
    const u = CT.Utils
    const updateError = u.curry((id, message) => {
        try {
            const element = getElement(id)
            element.innerText = message
        } catch (e) {
            console.error(`Unable to locate DOM element for ID '${id}'. ${e}`)
        }
    })
    // const debounce = CT.Decorators.debounce(addCommands, 400);

    function bindDependencies (viewModel) {
        let bmiMapper = BmiMapper()

        // update bmi value when height or weight is changed
        viewModel.set('bmi',function() {
            return bmiMapper.calculateBmi(this.get('weight.value'), this.get('height.value'))
        })

        // initialize bmi grid
        const dataSource = { dataSource: { data: {}}, columns: {}, width: 1500, height: 830 }
        dataSource.dataSource.data = bmiMapper.getBmiGridData()
        // dataSource.columns = bmiMapper.getBmiColumnInfo()
        $('#gridId').kendoGrid(dataSource)
    }

    (function() {
        viewModel.registerValidations('age.value',
            [v.isInRange(viewModel.get('age.min'), viewModel.get('age.max')),
                v.isPositive, v.isNumber],
            updateError("errorId1"));

        viewModel.registerValidations('height.value',
            [v.isInRange(viewModel.get('height.min'), viewModel.get('height.max')),
                v.isPositive, v.isNumber],
            updateError("errorId2"));

        viewModel.registerValidations('weight.value',
            [v.isInRange(viewModel.get('weight.min'), viewModel.get('weight.max')),
                v.isPositive, v.isNumber],
            updateError("errorId3"));

        // This is calculated field, so limits are defined manually, but
        // it can be pulled from other source too.
        viewModel.registerValidations('bmi',
            [v.isInRange(12, 42), v.isPositive, v.isNumber],
            updateError("errorId4"));

        ageEdit.addEventListener('keyup', (event) => {
            addCommands(event, 'age.value', ageEdit.value);
        })

        heightEdit.addEventListener('keyup', (event) => {
            addCommands(event, 'height.value', heightEdit.value);
        })

        weightEdit.addEventListener('keyup', (event) => {
            addCommands(event, 'weight.value', weightEdit.value);
        })

        bindDependencies(viewModel)
    })()

    function addCommands(event, prop, value) {
        if (event.key === 'Enter') {
            history.record(prop, new EditCommand(viewModel, function (readCache) {
                this.set(prop, readCache ? null : value)
            }))
        }
    }
}