'use strict'
const undoRedo = new UndoRedo()
const BmiController = function (viewModel) {
    const v = CT.Validations
    const u = CT.Utils

    const ageEdit = getElement('ageId')
    const heightEdit = getElement('heightId')
    const weightEdit = getElement('weightId')

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

    function bindCommands (viewModel) {
        viewModel.set('age.undo', function () {
            undoRedo.undo('age.value')
        })

        viewModel.set('age.redo', function () {
            undoRedo.redo('age.value')
        })

        // TODO_SK get rid of this, needs this strangely to call undo/redo commands
        viewModel.set('apply', function () {})
    }

    (function() {
        viewModel.registerValidations('age.value',
            [v.isInRange(viewModel.get('age.min'), viewModel.get('age.max')),
                v.isPositive('Age must be a positive number'),
                v.isNumber('Please enter a valid number')],
            u.updateError("errorId1"));

        viewModel.registerValidations('height.value',
            [v.isInRange(viewModel.get('height.min'), viewModel.get('height.max')),
                v.isPositive('Height must be a positive number'),
                v.isNumber('Please enter a valid number')],
            u.updateError("errorId2"));

        viewModel.registerValidations('weight.value',
            [v.isInRange(viewModel.get('weight.min'), viewModel.get('weight.max')),
                v.isPositive('Weight must be a positive number'),
                v.isNumber('Please enter a valid number')],
            u.updateError("errorId3"));

        // This is calculated field, so limits are defined manually, but
        // it can be pulled from other source too.
        viewModel.registerValidations('bmi',
            [v.isInRange(12, 42),
                v.isPositive('bmi must be a positive number'),
                v.isNumber('Please enter a valid number')],
            u.updateError("errorId4"));

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

        bindCommands(viewModel)
    })()

    function addCommands(event, prop, value) {
        if (event.key === 'Enter') {
            undoRedo.push(prop, new EditCommand(viewModel, function (readCache) {
                this.set(prop, readCache ? null : value)
            }))
        }
    }
}