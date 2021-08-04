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

CT.Utils.match = CT.Utils.curry((regx, str) => str.test(regx));

CT.Utils.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}