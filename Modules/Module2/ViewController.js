'use strict'
const undoRedo = new UndoRedo(UNDO_REDO_ITEMS.commands)

const ViewController = function (viewModel) {
    const v = CT.Validations
    const u = CT.Utils;
    const g = CT.GridUtils
    const a = CT.ArrayUtils

    function registerValidations(viewModel) {
        viewModel.registerValidations('fage.value',
            [
                v.fetchAndCompare(
                    "Fathers age should be greater than sons age",
                    (sage, fage) => fage < sage, // criterion to compare
                    () => viewModel.get('sage.value') // value to compare with
                ),
                v.isPositive('Age must be a positive number')],
            u.updateError("errorId1")
        );

        // TODO: validations compares with old value rather than changed
        viewModel.registerValidations('sage.value',
            [
                v.fetchAndCompare(
                    "Sons age should be less than fathers age",
                    (fage, sage) => sage > fage, // criterion to compare
                    () => viewModel.get('fage.value') // value to compare with
                ),
                v.isPositive('Age must be a positive number')],
            u.updateError("errorId2")
        );

        // map each element of a grid column and check for number validation
        viewModel.registerValidations('ageGrid.value',
            [
                g.map(
                    u.chainAndCompose([
                        v.isInRange(0, 100),
                        v.isPositive('Age must be a positive number'),
                        u.getData('fage'),
                        v.compareProp(
                            "Fathers age should be greater than sons age",
                            (sage, fage) => sage > fage,
                            'sage', 'fage'
                        )]
                    )
                ),
                a.hasDuplicates('Duplicate values', 'fage')
            ],
            u.logConsole
        );

        // TODO: won't register as 'ageGrid.value' is already a map key, fix it
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
        const pushAddRemoveCommand = (index) => {
            const add = g.addRowAt(index)
            // index + 1 - inserted row has higher index after addition
            // so removal needs to be done at index 1 more than the inserted one.
            const remove = g.removeRowAt(index + 1)
            undoRedo.push('ageGridId', new AddRemoveCommand(g,
                () => add('ageGridId'),
                () => remove('ageGridId'))
            )
        }
        viewModel.set('addRow', function () {
            const index = g.addRow(CELL_INSERTION_POSITION.end, 'ageGridId')
            pushAddRemoveCommand(index)
        })

        viewModel.set('addBeforeRow', function () {
            const index = g.addRow(CELL_INSERTION_POSITION.before, 'ageGridId')
            pushAddRemoveCommand(index)
        })

        viewModel.set('addAfterRow', function () {
            const index = g.addRow(CELL_INSERTION_POSITION.after, 'ageGridId')
            pushAddRemoveCommand(index)
        })

        viewModel.set('removeRow', function () {
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