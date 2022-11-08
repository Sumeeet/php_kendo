// TODO: replace this with RxJs, only using it for educational purpose
const Observable = function (observableFunc) {
  const subscribe = function (next, error, complete) {
    if (typeof next === "function") {
      return observableFunc({
        next,
        error: error || function () {},
        complete: complete || function () {},
      });
    } else {
      return observableFunc(next);
    }
  };

  const map = function (projectedFunc) {
    return new Observable((observer) => {
      return this.subscribe({
        next(value) {
          observer.next(projectedFunc(value));
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
  };

  const filter = function (filterFunc) {
    return new Observable((observer) => {
      return this.subscribe({
        next(value) {
          if (filterFunc(value)) {
            observer.next(value);
          }
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
  };

  const share = function () {
    // subscribers count
    let refCount = 0;
    // subject works as an observer and stores all the collection
    // of observers to be notified
    const subject = new Subject();
    // main subject is an actual producer of events
    const mainSubject = this.subscribe(subject);
    return new Observable((observer) => {
      refCount++;
      const sub = subject.subscribe(observer);
      return () => {
        refCount--;
        if (refCount === 0) mainSubject(); // unsubscribe main observer
        sub(); // unsubscribe individual observer
      };
    });
  };

  return { subscribe, map, filter, share };
};

const Subject = function () {
  const observers = [];

  const next = function (value) {
    observers.forEach((obs) => obs.next(value));
  };

  const subscribe = function (subscriber) {
    observers.push(subscriber);
    return () => {
      if (observers.length > 0) {
        const index = observers.indexOf(subscriber);
        0 <= index && observers.splice(index, 1);
      }
    };
  };

  return { subscribe, next };
};

var CT = CT || {};
CT.Observable = CT.Observable || {};

CT.Observable.fromEvent = (element, event) => {
  return new Observable((observer) => {
    const publishMessage = (e) => {
      e.stopImmediatePropagation();
      observer.next(e);
      e.preventDefault();
    };

    element.addEventListener(event, publishMessage);

    return () => element.removeEventListener(event, publishMessage);
  });
};

CT.Observable.merge = function (...observables) {
  return new Observable((observer) => {
    const subscribers = observables.map((observable) => {
      observable.subscribe(observer);
    });

    return () => {
      subscribers.forEach((subscriber) => subscriber.unsubscribe());
    };
  });
};
