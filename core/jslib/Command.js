const EditCommand = function (receiver, action, canAction = () => true) {
    const execute = function () {
        return action.apply(receiver, arguments)
    }

    const canExecute = function () {
        return canAction.apply(receiver, arguments)
    }
    return  { execute, canExecute }
}

const AddRemoveCommand = function (receiver, addAction, removeAction,
    canAction = () => true) {
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

    const canExecute = function () {
        return canAction.apply(receiver, arguments)
    }
    return  { execute, canExecute }
}


const CommandMessage = function (targetId, command) {
    // forward calls to other command objects
    return Object.assign({ targetId: targetId }, command)
}