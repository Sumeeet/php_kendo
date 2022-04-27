var CT = CT || {};
CT.ArrayUtils = CT.ArrayUtils || {};

CT.ArrayUtils.isArray = (val) =>
    Array.isArray(val) ? Either.of(val) :
        CT.Utils.left(`${val} is not an array`)

CT.ArrayUtils.hasDuplicates = CT.Utils.curry( (msg, arr) => {
    const duplicates = {}
    const find = CT.Utils.curry((d, e) => d[e] = (d[e] || 0) + 1)
    const execute = CT.Utils.compose(
        CT.Utils.chain(CT.Utils.forEach(find(duplicates))),
        CT.Utils.chain(CT.ArrayUtils.isArray),
        Maybe.of)

    execute(arr)
    return duplicates
})