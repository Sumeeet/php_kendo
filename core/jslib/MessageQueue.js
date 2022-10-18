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
        subscribers.forEach(sub => {
            if (sub.canExecute(sub.targetId)) {
                sub.execute(sub.targetId)
            } else {
                console.log(`unable to process message: ${message}`)
            }
        })
    }

    const publish = function(message) {
        marker = marker + 1
        messageQueue.splice(marker, messageQueue.length - marker, message)
        notify(message)
    }

    const playBack = function () {
        if (!canLookBack(marker)) {
            return
        }

        let message = peekInHistory(marker)
        notify(message)
        marker = marker - 1
    }

    const playForward = function () {
        let index = marker + 1
        if (!canLookForward(index)) return
        let message = peekInHistory(index)
        notify(message);
        marker = index
    }

    const erase = function () {
        messageQueue = []
        marker = -1
    }

    const subscribe = function (commands) {
        subscribers = [...subscribers, ...commands]
    }

    return { publish, playBack, playForward, erase, subscribe }
}