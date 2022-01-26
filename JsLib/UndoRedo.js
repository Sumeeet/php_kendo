const UndoRedo = function() {
    let undoStack = []
    let redoStack = []
    const STACK_SIZE = 10

    const isEmpty = function(arr) {
        return (arr.length === 0)
    }

    const peek = (arr) => {
        const length = arr.length
        if (length === 0) return null
        return arr[length - 1]
    }

    const push = function(obj) {
        if (undoStack.size > STACK_SIZE) {
            // remove the oldest object from the stack
            console.log(`Undo stack exceeded the size of ${STACK_SIZE}, removing an oldest value ${undoStack.shift()}`)
        }
        undoStack.push(obj)
    }

    const clear = function() {
        undoStack = []
        redoStack = []
    }

    const undo = function(orgObj) {
        if (isEmpty(undoStack)) return null
        const elem = undoStack.pop()
        redoStack.push(elem)
        return peek(undoStack) ?? orgObj
    }

    const redo = function() {
        if (isEmpty(redoStack)) return null
        const elem = redoStack.pop()
        undoStack.push(elem)
        return elem
    }

    const undoSize = function() {
        return undoStack.length
    }

    const redoSize = function() {
        return redoStack.length
    }

    return { push, clear, undo, redo, undoSize, redoSize }
}