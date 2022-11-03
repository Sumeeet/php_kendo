var CT = CT || {};
CT.Utils = CT.Utils || {};

CT.Utils.compose = (...fns) => (...args) => fns.reduceRight((res, fn) =>
    [fn.call(null, ...res)], args)[0];

CT.Utils.curry = (fn) => {
    const arity = fn.length;
    return function $curry(...args) {
        if (args.length < arity) {
            return $curry.bind(null, ...args);
        }
        return fn.call(null, ...args);
    };
}

CT.Utils.forEach = CT.Utils.curry((func, functor) => functor.forEach((e, i) => func(e, i)));

//CT.Utils.forEachFill = CT.Utils.curry((obj, func, functor) => functor.forEach((e, i) => func(obj, e, i)));

CT.Utils.reduce = CT.Utils.curry((func, initialValue, functor) => functor.reduce(func, initialValue))

CT.Utils.map = CT.Utils.curry((func, functor) => functor.map(func));

CT.Utils.chain = CT.Utils.curry((func, m) => m.chain(func));

CT.Utils.join = CT.Utils.curry((delimiter, functor) => functor.join(delimiter));

CT.Utils.match = CT.Utils.curry((regx, str) => str.match(regx) !== null);

CT.Utils.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

CT.Utils.left = (x) => new Left(x);

CT.Utils.identity = x => x;

CT.Utils.either = CT.Utils.curry((f, g, e) => {
    switch (e.constructor) {
        case Left:
            return Message(MESSAGE_TYPE.error, '', f(e.$val))
        case Right:
            return Message(MESSAGE_TYPE.debug, '', `value ${g(e.$val)} applied successfully`)
        case Array:
            // already evaluated
            return e
        default:
            throw new Error('Unknown result type')
    }
});

CT.Utils.toFixed = CT.Utils.curry((decimals, value) => Number(value).toFixed(decimals))

// mutate values in array v
CT.Utils.mapAt = CT.Utils.curry((f, i, v) => {
    const something = CT.Utils.compose(CT.Utils.map(f), Maybe.of)
    const maybe = something(v[i])
    if (!maybe.isNothing) v[i] = maybe.join()
    return v
})

CT.Utils.validateAt = CT.Utils.curry((f, i, v) => {
    const something = CT.Utils.compose(
        CT.Utils.chain(f),
        Either.of)
    const result = something(v[i])
    return { result: result, orgValue: v }
})

// TODO: very confusing, clean it
CT.Utils.concat = CT.Utils.curry((f, r) => {
    const result = f(r.orgValue)
    const results = [r.result, result.result]
    return { result: results, orgValue: r.orgValue }
})

CT.Utils.sort = CT.Utils.curry((func, functor) => functor.sort(func));

CT.Utils.updateError = CT.Utils.curry((id, result) => {
    try {
        const element = document.getElementById(id)
        element.innerText = result.pass ? '' : result.message
    } catch (e) {
        console.error(`Unable to locate DOM element for ID '${id}'. ${e}`)
    }
})

CT.Utils.IfElse = CT.Utils.curry((cond, func1, func2, v) => cond(v) ? func1(v) : func2(v))

CT.Utils.filter = CT.Utils.curry((func, functor) => functor.filter(func))

CT.Utils.getData = CT.Utils.curry((prop, data) => {
    const getData = CT.Utils.compose(
        CT.Utils.chain((data) => Either.of(data[prop])),
        CT.Utils.chain(CT.Utils.propExist('Property does not exist', prop)),
        Maybe.of)
    return getData(data)
})

CT.Utils.propExist = CT.Utils.curry((msg, prop, data) =>
    data.hasOwnProperty(prop) ? Either.of(data) : CT.Utils.left(`${msg}: ${prop}`)
)

CT.Utils.chainAndCompose = (fns) => {
    const first = fns.pop()
    let composedFns = fns.map(fn => CT.Utils.chain(fn))
    if (first) {
        composedFns.push(first)
    }
    composedFns.splice(0, 0, CT.Utils.either(CT.Utils.identity, CT.Utils.identity))
    return CT.Utils.compose(...composedFns)
}

CT.Utils.LoadTemplates = (paths) => {
    const loadTemplate = CT.Utils.curry((options, path) => fetch(path))

    const awaitLoadTemplates = (loadTemplatesFunc) => {
        return Promise.all(loadTemplatesFunc)
        .then((response) => response[0].text())
        .catch(e => console.log(
            `There has been a problem with loading templates : ${e.message}`))
    }

    const execute = CT.Utils.compose(
        awaitLoadTemplates,
        CT.Utils.chain(CT.Utils.map(loadTemplate({'method': 'GET'}))),
        Maybe.of
    )

    return execute(paths)
}

CT.Utils.isUndefined = (obj) => obj === null || obj === undefined || obj === ''

CT.Utils.makeShortCutKey = (e) =>
    (e.ctrlKey ? 'ctrl ' : '') +
    (e.shiftKey ? 'shift ' : '') +
    (e.altKey ? 'alt ' : '') +
    e.key.toLowerCase()