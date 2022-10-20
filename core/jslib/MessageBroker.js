const MessageBroker = function () {
    const su = CT.StringUtils
    const u = CT.Utils
    let messageQueueMap = new Map()

    // const splitTrim = u.compose(u.map(su.trim), su.split)
    // const splitTrimStrings = u.curry((func, delimiter, value) => func(delimiter, value))
    // const splitTrimShortcuts = splitTrimStrings(splitTrim, ' ')

    const subscribe = function (triggers, name, listeners) {
        // TODO Generate a unique name
        const queueName = `${name}_queue`
        let queue = messageQueueMap.get(queueName)
        if (!queue) {
            queue = new MessageQueue(queueName)
            messageQueueMap.set(queueName, queue)
        }

        const publishMessage = (e) => {
            e.stopImmediatePropagation()
            const q = messageQueueMap.get(queueName)
            q.publish(e.type)
            e.preventDefault()
        }

        const addEventsListener = (trigger) => {
            trigger.element.addEventListener(trigger.event,
                (e) => {
                    if (trigger.event === 'click') {
                        publishMessage(e)
                    }
                    else if (trigger.event == 'keyup') {
                        const shortcut = (e.ctrlKey ? 'ctrl ' : '') +
                            (e.shiftKey ? 'shift ' : '') +
                            (e.altKey ? 'alt ' : '') + e.key.toLowerCase()
                        if (shortcut === trigger.shortcut.toLowerCase())
                            publishMessage(e)
                    }
                })
        }

        u.map(addEventsListener, triggers)
        bind(queueName, listeners)
    }

    const bind = function (queueName, listeners) {
        const queue = messageQueueMap.get(queueName)
        if (queue) {
            queue.subscribe(listeners)
        }
    }

    return { subscribe }
}

const messageBroker = new MessageBroker('');
