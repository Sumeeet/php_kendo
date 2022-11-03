const CELL_INSERTION_POSITION = { after: 'AFTER', before: 'BEFORE', start: 'START', end: 'END' }
Object.freeze(CELL_INSERTION_POSITION)

const UNDO_REDO_ITEMS = { value: 1, commands: 0 }
Object.freeze(UNDO_REDO_ITEMS)

const KEYBOARD_SHORTCUTS = {
    add: 'ctrl shift +', // add a row to the grid
    remove: 'ctrl shift -', // remove row(s) from the grid. Multiple selected rows can be removed
    undo: 'ctrl z', // general undo
    redo: 'ctrl y' // general redo
}
Object.freeze(KEYBOARD_SHORTCUTS)

const MOUSE_BUTTON = {
    left: 0, // left button clicked
    middle: 1,
    right: 2
}
Object.freeze(MOUSE_BUTTON)

const MESSAGE_TYPE = {
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    debug: 'Debug'
}