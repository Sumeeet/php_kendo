'use strict'
const undoRedo = new UndoRedo(UNDO_REDO_ITEMS.commands)

const ViewController = function (viewModel) {
    const v = CT.Validations
    const u = CT.Utils;
    const g = CT.GridUtils

    function registerValidations(viewModel) {
        viewModel.registerValidations('fage.value', [v.compare
            (
                "Fathers age should be greater than sons age",
                (sage, fage) => fage < sage, // criterion to compare
                viewModel.get('sage.value') // value to compare with
            ), v.isPositive('Age must be a positive number')],
            u.updateError("errorId1")
        );

        // TODO: validations compares with old value rather than changed
        viewModel.registerValidations('sage.value',[v.compare
            (
                "Sons age should be less than fathers age",
                (fage, sage) => sage > fage, // criterion to compare
                viewModel.get('fage.value') // value to compare with
            ), v.isPositive('Age must be a positive number')],
            u.updateError("errorId2")
        );

        // map each element of a grid column and check for number validation
        viewModel.registerValidations('ageGrid.value',
            [g.map(u.compose(
                v.isPositive('Age must be a positive number'),
                u.getData('fage')
            ))]
        );

        // map each element of a grid column and check for number validation
        viewModel.registerValidations('ageGrid.value',
            [g.map(u.compose(
                v.isPositive('Age must be a positive number'),
                u.getData('sage')
            ))]
        );
    }

    function bindDependencies (viewModel) {
        // const data = CT.GridUtils.populate(viewModel.get('ageGrid.value'),
        //     CT.GridUtils.getColumnNames(gridInfo.columns))

        const data = viewModel.get('ageGrid.value')
        const dataSource = {
            columns: gridInfo.columns,
            dataSource: data,
            width: gridInfo.width,
            height: gridInfo.height,
            selectable: "row",
            editable: "incell" }
        $('#ageGridId').kendoGrid(dataSource)

        //viewModel.set('ageGrid.value', data)
    }

    function bindCommands (viewModel) {
        viewModel.set('ageGrid.addRow', function () {
            const add = g.addRow(CELL_INSERTION_POSITION.end)
            const remove = g.removeRow(CELL_INSERTION_POSITION.end)
            undoRedo.push('ageGridId', new AddRemoveCommand(g,
                () => add('ageGridId'),
                () => remove('ageGridId'))
            )
            add('ageGridId')
        })

        viewModel.set('ageGrid.addBeforeRow', function () {
            g.addRow(CELL_INSERTION_POSITION.before, 'ageGridId')
        })

        viewModel.set('ageGrid.addAfterRow', function () {
            g.addRow(CELL_INSERTION_POSITION.after, 'ageGridId')
        })

        viewModel.set('ageGrid.removeRow', function () {
            CT.GridUtils.removeRow(CELL_INSERTION_POSITION.end, 'ageGridId')
        })

        // TODO_SK get rid of this, needs this strangely to execute bind commands
        viewModel.set('apply', function () {
        })
    }

    // function getGridInfo(data) {
    //     if (!gridInfo || !data) return []
    //
    //     // TODO: add missing columns headers
    //     const addMissingColumns = u.compose(
    //         u.map(),
    //         u.chain(u.filter((row) => 0)),
    //         Maybe.of
    //     )
    //
    //     return addMissingColumns(data)
    // }

    (function() {
        registerValidations(viewModel)

        bindDependencies(viewModel)

        bindCommands(viewModel)
    })();
}