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
            u.logConsole
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
            u.logConsole
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

        const disableElement = CT.Utils.curry((gridId, id) => {
            const element = getElement(id)
            g.hasData(gridId) ? element.removeAttribute('disabled') :
                element.setAttribute('disabled', '')
        })

        messageBroker.subscribe('addRow', [
                new CommandMessage('ageGridId',
                    new EditCommand (u,
                        u.compose(
                            pushAddRemoveCommand,
                            g.addRow(CELL_INSERTION_POSITION.after)
                        ))),
                new CommandMessage('removeRowId',
                    new EditCommand(u, disableElement('ageGridId')))
            ]
        )

        messageBroker.subscribe('removeRow', [
                new CommandMessage('ageGridId',
                    new EditCommand(u,
                        g.removeRow,
                        g.hasData)),
                new CommandMessage('removeRowId',
                    new EditCommand('u', disableElement('ageGridId')))
            ]
        )
    }

    (function() {
        registerValidations(viewModel)

        bindCommands(viewModel)
    })();
}