'use strict'
const undoRedo = new UndoRedo()
const ViewController = function (viewModel) {
    const v = CT.Validations
    const u = CT.Utils;
    const g = CT.GridUtils;

    function bindDependencies (viewModel) {
        const data = CT.GridUtils.populate(viewModel.get('ageGrid.value'), ["fage", "sage"])
        viewModel.set('ageGrid.value', data)

        const dataSource = {
            columns: gridInfo.columns,
            dataSource: data,
            width: gridInfo.width,
            height: gridInfo.height,
            editable: "incell" }
        $('#ageGridId').kendoGrid(dataSource)
    }

    function bindCommands (viewModel) {
        viewModel.set('ageGrid.addRow', function () {
            const add = CT.GridUtils.addRow(CELL_INSERTION_POSITION.end)
            const remove = CT.GridUtils.removeRow(CELL_INSERTION_POSITION.end)
            undoRedo.push('ageGridId', new CompositeAddRemoveCommand(CT.Actions,
                () => add('ageGridId'),
                () => remove('ageGridId'))
            )
            add('ageGridId')
        })

        viewModel.set('ageGrid.removeRow', function () {
            const removeRowCommand = new RemoveRowCommand(CT.Actions)
            removeRowCommand.execute('ageGridId', CELL_INSERTION_POSITION.end)
        })

        // TODO_SK get rid of this, needs this strangely to execute bind commands
        viewModel.set('apply', function () {
            return;
        })
    }

    function getGridInfo(data) {
        if (!gridInfo || !data) return []

        // TODO: add missing columns headers
        const addMissingColumns = u.compose(
            u.map(),
            u.chain(u.filter((row) => 0)),
            Maybe.of
        )

        return addMissingColumns(data)
    }

    (function() {
        viewModel.registerValidations('fage.value', [v.compare
            (
                "Fathers age should be greater than sons age",
                (sage, fage) => fage < sage, // criterion to compare
                viewModel.get('sage.value') // value to compare with
            ), v.isPositive('Age must be a positive number')],
            u.updateError("errorId1")
        );

        viewModel.registerValidations('sage.value',[v.compare
            (
                "Sons age should be less than fathers age",
                (fage, sage) => sage > fage, // criterion to compare
                viewModel.get('fage.value') // value to compare with
            ), v.isPositive('Age must be a positive number')],
            u.updateError("errorId2")
        );

        bindDependencies(viewModel)

        bindCommands(viewModel)
    })();
}