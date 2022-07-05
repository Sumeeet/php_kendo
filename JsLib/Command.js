const Command = function (receiver) {}

const EditCommand = function (receiver, action) {
    const execute = function () {
        action.apply(receiver, arguments)
    }
    return  { execute }
}

const AddRowCommand = function (receiver, action = CT.Actions.addRow) {
    const execute = function () {
        action.apply(receiver, arguments)
    }
    return  { execute }
}

const RemoveRowCommand = function (receiver, action = CT.Actions.removeRow) {
    const execute = function () {
        action.apply(receiver, arguments)
    }
    return  { execute }
}