const GridActionSubscription = (gid) => {

    const keyup = CT.Observable.fromEvent(getElement(gid), 'keyup')
    .map(e => CT.Utils.makeShortCutKey(e))
    .share()

    return {
        addRow: (eid) => {
            const addRow = new AddRowCommand()
            const click = CT.Observable.fromEvent(getElement(eid),
                'click').filter(e => e.button === MOUSE_BUTTON.left)

            const shortcut = keyup.filter((shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.add)
            const merged = CT.Observable.merge(click, shortcut)
            merged.subscribe({
                next (e) { addRow(gid) }
            })

            // lets others listen to this change
            return merged
        },

        removeRow: (eid) => {
            const removeRow = new RemoveRowCommand()
            const click = CT.Observable.fromEvent(getElement(eid),
                'click').filter(e => e.button === MOUSE_BUTTON.left)

            const shortcut = keyup.filter((shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.remove)
            const merged = CT.Observable.merge(click, shortcut)
            merged.subscribe({
                next (e) { removeRow(gid) }
            })

            // lets others listen to this change
            return merged
        }
    }
}