const messageBroker = new MessageBroker('');

((target) => {
    // register for most commonly used events
    const eventType = ['click', 'dbclick', 'keyup']

    const processEvents = (event) => {
        if (event.type === 'click') {
            const message = event.target.getAttribute('message')
            if (CT.Utils.isUndefined(message)) return
            messageBroker.broadcastMessage(message)
        } else if(event.type === 'keyup') {
            if (event.ctrlKey) {
                console.log(`KeyboardEvent: key='${event.key}' | code='${event.code}'`)
            }
        }
    }

    eventType.forEach((type) => {
        target.addEventListener(type, processEvents)
    })
})(window)
