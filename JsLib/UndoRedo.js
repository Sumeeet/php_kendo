const UndoRedo = function(steps = 50) {
    let undoStack = []
    let redoStack = []

    const peek = function(arr, length) {
        if (length === 0) return null
        return arr[length - 1]
    }

    const push = function(obj) {
        if (undoStack.size > 50) {
            // remove the oldest object from the stack
            console.log(`Undo stack exceeded the size of 50, removing an oldest value ${undoStack.shift()}`)
        }
        undoStack.push(obj)
    }

    const clear = function() {
        undoStack = []
        redoStack = []
    }

    const undo = function(obj) {
        const length = undoStack.length
        if (length === 0) return null
        const elem = undoStack.pop()
        redoStack.push(elem)
        return peek(undoStack, length)
    }

    const redo = function(obj) {
        const elem = redoStack.pop()
        undoStack.push(elem)
        return elem
    }

    return { push, clear, undo, redo }
}