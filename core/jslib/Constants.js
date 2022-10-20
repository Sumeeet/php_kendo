const CELL_INSERTION_POSITION = { after: 'AFTER', before: 'BEFORE', start: 'START', end: 'END' }
Object.freeze(CELL_INSERTION_POSITION)

const UNDO_REDO_ITEMS = { value: 1, commands: 0 }
Object.freeze(UNDO_REDO_ITEMS)

const KEYBOARD_SHORTCUTS = {
    add: 'ctrl shift +',
    remove: 'ctrl shift -',
    undo: 'ctrl z',
    redo: 'ctrl y'
}