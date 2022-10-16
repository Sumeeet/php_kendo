const messageBroker = new MessageBroker('');

((target) => {
    // register for most commonly used events
    const eventType = ['click', 'dbclick', 'keyup']

    const processEvents = (event) => {
        const message = event.target.getAttribute('message')
        if (CT.Utils.isUndefined(message)) return
        messageBroker.broadcastMessage(message)
    }

    eventType.forEach((type) => {
        target.addEventListener(type, processEvents)
    })
})(window)
