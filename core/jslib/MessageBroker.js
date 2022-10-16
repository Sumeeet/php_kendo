const MessageBroker = function () {
    const su = CT.StringUtils
    const u = CT.Utils
    let messageQueueMap = new Map()

    const splitTrim = u.compose(u.map(su.trim), su.split)
    const splitTrimStrings = u.curry((func, delimiter, value) => func(delimiter, value))
    const splitTrimMessage = splitTrimStrings(splitTrim, '|')

    const broadcastMessage = function (message) {
        const broadcast = (msg) => {
            const queueName = `${msg}Queue`
            let queue = messageQueueMap.get(queueName)
            if (queue) {
                console.log(`message: ${msg}`)
                // notify subscribers
                queue.add(msg)
            }
        }

        const execute = CT.Utils.compose(
            u.map(u.forEach(broadcast)),
            u.map(splitTrimMessage),
            Maybe.of)
        execute(message)
    }

    const subscribe = function (message, command) {
        const sub = (msg) => {
            const queueName = `${msg}Queue`
            let queue = messageQueueMap.get(queueName)
            if (!queue) {
                queue = new MessageQueue(queueName)
                messageQueueMap.set(queueName, queue)
            }

            // client (command knows how to handle a request when a message is received)
            queue.subscribe(command)
        }

        const execute = CT.Utils.compose(
            u.map(u.forEach(sub)),
            u.map(splitTrimMessage),
            Maybe.of)

        execute(message)
    }

    return { broadcastMessage, subscribe }
}
