const Command = function (receiver) {}

const EditCommand = function (receiver, action) {
    const execute = function () {
        action.apply(receiver, arguments)
    }

    return  { execute }
}