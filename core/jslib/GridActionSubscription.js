const GridActionSubscription = (gid) => {

    const pushAddRemoveCommand = (index) => {
        const add = CT.GridUtils.addRowAt(index)
        const remove = CT.GridUtils.removeRowAt(index)
        undoRedo.push('ageGridId', new AddRemoveCommand(CT.GridUtils,
            () => add('ageGridId'),
            () => remove('ageGridId'))
        )
    }

    const disableElement = CT.Utils.curry((gridId, element) => {
        CT.GridUtils.hasData(gridId) ? element.removeAttribute('disabled') :
            element.setAttribute('disabled', '')
    })

    const keyup = CT.Observable.fromEvent(getElement(gid), 'keyup')
    .map(e => CT.Utils.makeShortCutKey(e))
    .share()


    const addRow = (eid = 'addRowId') => {
            const addRow = new AddRowCommand()
            const click = CT.Observable.fromEvent(getElement(eid), 'click')
            .filter(e => e.button === MOUSE_BUTTON.left)

            // TODO: How to pass values to different subscribers ? Use map for now
            // TODO: one way is to compose dependent operations on client side
            const shortcut = keyup.filter((shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.add)
            const merged = CT.Observable.merge(click, shortcut)
            .share()  // let all the subscriber listen to same observable

            merged.subscribe({
                next (e) {
                    CT.Utils.compose(
                        () => disableElement(gid, getElement('removeRowId')),
                        pushAddRemoveCommand,
                        addRow
                    )(gid)
                }
            })

            // lets others listen to this change
            return merged
        }

    const removeRow = (eid = 'removeRowId') => {
        const removeRow = new RemoveRowCommand()
        const click = CT.Observable.fromEvent(getElement(eid),
            'click').filter(e => e.button === MOUSE_BUTTON.left)

        const shortcut = keyup.filter((shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.remove)
        const merged = CT.Observable.merge(click, shortcut)
        .share()  // let all the subscriber listen to same observable
        merged.subscribe({
            next (e) {
                removeRow(gid)
                disableElement(gid, getElement(eid))
            }
        })

        return merged
    }

    const undoRow = (eid = 'undoId') => {
        const clickObservable = CT.Observable.fromEvent(getElement(eid), 'click')
        .filter(e => e.button === MOUSE_BUTTON.left)

        const undoObservable = keyup.filter((shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.undo)
        const merge = CT.Observable.merge(clickObservable, undoObservable).share()
        merge.subscribe({
            next (e) {
                undoRedo.undo(gid)
            }
        })

        return merge
    }

    const redoRow = (eid = 'redoId') => {
        const clickObservable = CT.Observable.fromEvent(getElement(eid), 'click')
        .filter(e => e.button === MOUSE_BUTTON.left)

        const undoObservable = keyup.filter((shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.redo)
        const merge = CT.Observable.merge(clickObservable, undoObservable).share()
        merge.subscribe({
            next (e) {
                undoRedo.redo(gid)
            }
        })

        return merge
    }

    (() => {
        addRow()
        removeRow()
        undoRow()
        redoRow()
    })()
}