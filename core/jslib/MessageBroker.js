const MessageBroker = function () {
    const su = CT.StringUtils
    const u = CT.Utils
    let messageQueueMap = new Map()

    const splitTrim = u.compose(u.map(su.trim), su.split)
    const splitTrimStrings = u.curry((func, delimiter, value) => func(delimiter, value))
    const splitTrimMessage = splitTrimStrings(splitTrim, '|')

    const broadcastMessage = function (message) {
        const queueName = `${message}Queue`
        let queue = messageQueueMap.get(queueName)
        if (queue) {
            console.log(`message: ${message}`)
            // notify subscribers
            queue.publish(message)
        }
    }

    const subscribe = function (message, commands) {
        const queueName = `${message}Queue`
        let queue = messageQueueMap.get(queueName)
        if (!queue) {
            queue = new MessageQueue(queueName)
            messageQueueMap.set(queueName, queue)
        }

        // client (command knows how to handle a request when a message is received)
        queue.subscribe(commands)
    }

    return { broadcastMessage, subscribe }
}
