const UndoRedo = function(steps = 50) {
    let undoStack = []
    let redoStack = []

    const isEmpty = function(arr) {
        return (arr.length === 0)
    }

    const peek = (arr) => {
        const length = arr.length
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
        if (isEmpty(undoStack)) return null
        const elem = undoStack.pop()
        redoStack.push(elem)
        return peek(undoStack)
    }

    const redo = function(obj) {
        if (isEmpty(redoStack)) return null
        const elem = redoStack.pop()
        undoStack.push(elem)
        return elem
    }

    return { push, clear, undo, redo }
}