const MessageBroker = function () {
    let messageQueueMap = new Map()

    const broadcastMessage = function (message) {
        const queueName = `${message}Queue`
        let queue = messageQueueMap.get(queueName)
        if (queue) {
            // notify subscribers
            queue.add(message)
        }
    }

    const subscribe = function (message, command) {
        const queueName = `${message}Queue`
        let queue = messageQueueMap.get(queueName)
        if (!queue) {
            queue = new MessageQueue(queueName)
            messageQueueMap.set(queueName, queue)
        }

        // client (command knows how to handle a request when a message is received)
        queue.subscribe(command)
    }

    return { broadcastMessage, subscribe }
}
