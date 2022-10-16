const MessageQueue = function (name) {
    let messageQueue = []
    let subscribers = []
    let marker = -1

    const doesExist = function () {
        return messageQueue.length > 0
    }

    const canLookBack = function (index) {
        return doesExist() && index >= 0
    }

    const canLookForward = function (index) {
        const size = messageQueue.length
        return size > 0 && index < size
    }

    const peekInHistory = function (index) {
        return messageQueue[index]
    }

    const notify = function (message) {
        subscribers.forEach(sub => sub.execute(message))
    }

    const add = function(message) {
        marker = marker + 1
        messageQueue.splice(marker, messageQueue.length - marker, message)
        notify(message)
    }

    const playBack = function () {
        if (!canLookBack(marker)) {
            return
        }

        let message = peekInHistory(marker)
        notify()
        marker = marker - 1
    }

    const playForward = function () {
        let index = marker + 1
        if (!canLookForward(index)) return
        let message = peekInHistory(index)
        notify();
        marker = index
    }

    const erase = function () {
        messageQueue = []
        marker = -1
    }

    const subscribe = function (command) {
        subscribers.push(command)
    }

    return { add, playBack, playForward, erase, subscribe }
}