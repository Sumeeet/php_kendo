const EditCommand = function (receiver, action, canAction = () => true) {
    const canExecute = function () {
        return canAction.apply(receiver, arguments)
    }

    const execute = function () {
        if (canExecute(...arguments)) {
            return action.apply(receiver, arguments)
        }
    }

    return  { execute }
}

const AddRemoveCommand = function (id, addCommand, removeCommand) {
    let undo = true
    const execute = function() {
        if (undo) {
            removeCommand.execute(id)
            undo = false
        }
        else {
            addCommand.execute(id)
            undo = true
        }
    }
    return  { execute }
}

const AddRowCommand = function (
    receiver = CT.GridUtils,
    action = CT.GridUtils.addRow(CELL_INSERTION_POSITION.after),
    canAction = () => true) {

    const canExecute = function () {
        return canAction.apply(receiver, arguments)
    }

    return function () {
        if (canExecute(...arguments)) {
            return action.apply(receiver, arguments)
        }
    }
}

const RemoveRowCommand = function (
    receiver = CT.GridUtils,
    action = CT.GridUtils.removeRow,
    canAction = CT.GridUtils.hasData) {

    const canExecute = function () {
        return canAction.apply(receiver, arguments)
    }

    return function () {
        if (canExecute(...arguments)) {
            return action.apply(receiver, arguments)
        }
    }
}

const CommandMessage = function (targetId, command) {
    // forward calls to other command objects
    return Object.assign({ targetId: targetId }, command)
}