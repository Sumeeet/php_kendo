const Observable = function (observableFunc) {

    const subscribe = function (observers) {
        return observableFunc(observers)
    }

    return { subscribe }
}

var CT = CT || {};
CT.Observable = CT.Observable || {};

CT.Observable.fromEvents = (events) => {
    return new Observable( (observers) => {

        // const namedObservers = new Map()

        const publishMessage = (e) => {
            observers.forEach(observer => {
                e.stopImmediatePropagation()
                const id = observer.targetId
                if (observer.canExecute(id)) {
                    observer.execute(id)
                }
                e.preventDefault()
            })
        }

        const processEvents = CT.Utils.curry((event, e) => {
            if (event === 'click') {
                publishMessage(e)
            }
            else if (event == 'keyup') {
                const shortcut = (e.ctrlKey ? 'ctrl ' : '') +
                    (e.shiftKey ? 'shift ' : '') +
                    (e.altKey ? 'alt ' : '') + e.key.toLowerCase()
                if (shortcut === event.shortcut.toLowerCase())
                    publishMessage(e)
            }
        })

        const addEventsListener = (event) => {
            event.element.addEventListener(event.event, processEvents(event.event))
        }

        CT.GridUtils.map(addEventsListener, events)

        const unSubscribe = () => {
            observers = []
        }

        return { unSubscribe }
    })
}