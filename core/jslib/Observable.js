const Observable = function (observableFunc) {

    const subscribe = function (next, error, complete) {
        if (typeof next === "function") {
            return observableFunc({
                next,
                error: error || function () { },
                complete: complete || function () { }
            })
        } else {
            return observableFunc(next)
        }
    }

    const map = function (projectedFunc) {
        return new Observable(observer => {
            return this.subscribe({
                next (value) { observer.next(projectedFunc(value)) },
                error (err) { observer.error(err) },
                complete() { observer.complete() }
            })
        })
    }

    const filter = function(filterFunc) {
        return new Observable(observer => {
            return this.subscribe({
                next (value) {
                    if (filterFunc(value)){
                        observer.next(value)
                    }
                },
                error (err) { observer.error(err) },
                complete() { observer.complete() }
            })
        })
    }

    return { subscribe, map, filter }
}

var CT = CT || {};
CT.Observable = CT.Observable || {};

CT.Observable.fromEvent = (element, event) => {
    return new Observable( (observer) => {

        const publishMessage = (e) => {
            e.stopImmediatePropagation()
            observer.next(e)
            e.preventDefault()
        }

        element.addEventListener(event, publishMessage)

        return () => element.removeEventListener(event, publishMessage)
    })
}

CT.Observable.merge = function (...observables) {
    return new Observable((observer) => {
        const subscribers = observables.map(observable => {
            observable.subscribe(observer)
        })

        return () => {
            subscribers.forEach(subscriber => subscriber.unsubscribe())
        }
    })
}