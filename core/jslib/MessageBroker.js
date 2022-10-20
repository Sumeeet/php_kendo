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
                        const shortcut = (e.shiftKey ? 'shift ' : '') +
                            (e.ctrlKey ? 'ctrl ' : '') +
                            (e.altKey ? 'alt ' : '') + e.code
                        if (shortcut === trigger.shortcut)
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
