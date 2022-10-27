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

        const disableElement = CT.Utils.curry((gridId, element) => {
            g.hasData(gridId) ? element.removeAttribute('disabled') :
                element.setAttribute('disabled', '')
        })

        const makeShortCutKey = (e) =>
            (e.ctrlKey ? 'ctrl ' : '') +
            (e.shiftKey ? 'shift ' : '') +
            (e.altKey ? 'alt ' : '') +
            e.key.toLowerCase()

        // add row observables
        const addRow = new AddRowCommand()
        const removeRowElement = getElement('removeRowId')
        CT.Observable.fromEvent(getElement('addRowId'), 'click')
        .filter(e => e.button === MOUSE_BUTTON.left)
        .subscribe({
            next(e) {
                const index = addRow('ageGridId')
                pushAddRemoveCommand(index)
                disableElement('ageGridId', removeRowElement)
            }
        })

        // remove row observable
        const removeRow = new RemoveRowCommand()
        CT.Observable.fromEvent(removeRowElement, 'click')
        .filter(e => e.button === MOUSE_BUTTON.left)
        .subscribe({
            next(e) {
                removeRow('ageGridId')
                disableElement('ageGridId', removeRowElement)
            }
        })

        // grid keyboard shortcuts
        CT.Observable.fromEvent(getElement('ageGridId'), 'keyup')
        .map(e => makeShortCutKey(e))
        .subscribe({
            next(shortcutKey) {
                if (KEYBOARD_SHORTCUTS.add === shortcutKey) {
                    addRow('ageGridId')
                } else if (KEYBOARD_SHORTCUTS.remove === shortcutKey) {
                    removeRow('ageGridId')
                }
            }
        })
    }

    (function() {
        registerValidations(viewModel)

        bindCommands(viewModel)
    })();
}