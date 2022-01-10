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

CT.Utils.map = CT.Utils.curry((func, functor) => functor.map(func));

CT.Utils.chain = CT.Utils.curry((func, m) => m.chain(func));

CT.Utils.match = CT.Utils.curry((regx, str) => str.match(regx) !== null);

CT.Utils.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

CT.Utils.left = (x) => new Left(x);

CT.Utils.identity = x => x;

CT.Utils.either = CT.Utils.curry((f, g, e) => {
    let result;
    switch (e.constructor) {
        case Left:
            result = { pass: false, message: f(e.$val) };
            break;
        case Right:
            //result = { pass: true, message: `value ${g(e.$val)} applied successfully` };
            result = { pass: true, message: `` };
            break;
    }
    return result;
});