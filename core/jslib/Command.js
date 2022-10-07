const Command = function (receiver) {}

const EditCommand = function (receiver, action) {
    const execute = function () {
        action.apply(receiver, arguments)
    }
    return  { execute }
}

const AddRemoveCommand = function (receiver, addAction, removeAction) {
    let undo = true
    const execute = function () {
        if (undo) {
            removeAction.apply(receiver)
            undo = false
        }
        else {
            addAction.apply(receiver)
            undo = true
        }
    }
    return  { execute }
}