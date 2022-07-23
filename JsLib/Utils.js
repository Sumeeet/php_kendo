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
            return { pass: false, message: f(e.$val) }
        case Right:
            //result = { pass: true, message: `value ${g(e.$val)} applied successfully` };
            return { pass: true, message: `Success` }
        case Array:
            // TODO check each element of an array for Left or Right
            return e.map(r => { return {pass: false, message: f(r.$val)} })
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
        CT.Utils.chain(CT.Utils.identity),
        Maybe.of)
    return getData(data[prop])
})