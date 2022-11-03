var CT = CT || {};
CT.Decorators = CT.Decorators || {};

/**
 *
 * @param func
 * @returns {function(...[*]): (*)}
 */
CT.Decorators.localCache = function(func) {
    const cache = new Map();

    return function (...args) {
        const [key, options] = args;
        if (cache.has(key)) {
            return cache[key];
        }

        return func.apply(this, [options])
        .then(result => {
            cache.set(key, result);
            return result;
        })
        .catch(e => console.log(`Unable to fetch data: ${e.message}`))
    }
}

/**
 * Debounce function rejects all the intermediate calls happen before ms time
 * has elapsed and resets previous elapsed time to ms time again. Only when
 * timeout occurs then func is called. This helps in avoiding too many frequent
 * checks or changes
 * @param func Function called after ms time
 * @param ms time in milliseconds. Changed function 'func' shall be called
 * after ms time is elapsed.
 * @param recordFunc records which property is changed or changed last time
 * without adding duplicate. This is called regardless of time reset, as
 *     intermediate calls or property change needs to be captured.
 * @returns {function(): void}
 */
CT.Decorators.debounce = function(func, ms, recordFunc = null) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            if (recordFunc) recordFunc(...args);
            timeout = setTimeout(function() {
                func.apply(this, args)
            }, ms);
        };
}

/**
 * Convert simple function to an asynchronous function
 * @param func
 * @returns {function(): Promise<unknown>}
 */
CT.Decorators.makeAsync = function(func) {
    return function() {
        return new Promise((resolve, reject) => {
            if (!func) reject('Undefined function');
            else {
                const result = func.apply(this, arguments);
                resolve(result);
            }
        })
    }
}

CT.Decorators.delayBy = function (func, ms) {
    return function (...args) {
        setTimeout(function() {
            func.apply(this, args)
        }, ms);
    }
}