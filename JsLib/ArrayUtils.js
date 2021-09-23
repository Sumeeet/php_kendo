var CT = CT || {};
CT.ArrayUtils = CT.ArrayUtils || {};

CT.ArrayUtils.isArray = (val) =>
    Array.isArray(val) ? Either.of(val) :
        CT.Utils.left(`${val} is not an array`)

CT.ArrayUtils.isEqual = CT.Utils.curry((prop, orgVal, val) => {
    const errMsg = [];
    orgVal.forEach((v, i) => {
        if (v !== val[i]) {
            errMsg.pushMessage(CT.Utils.left(`${prop} changed: ${v} -> ${v[i]}`));
        }
    });
    return errMsg.length > 0 ? CT.Utils.left(errMsg) : CT.Utils.left(val);
});

CT.ArrayUtils.hasDuplicates = (array) => {
    const map = new Map();
    array.forEach((item, index) =>  {
        if (!map.has(item)) {
            map.set(item, [index]);
        } else {
            map.get(item).push(index);
        }
    });
    return Array.from(map.values()).filter((item) => item.length > 1);
}

CT.ArrayUtils.contains = (value, array) => {
    const map = new Map();
    array.forEach((item, index) =>  {
        if (item === value && !map.has(item)) {
            map.set(item, [index]);
        } else {
            map.get(item).push(index);
        }
    });
    return Array.from(map.values()).filter((item) => item.length > 0);
}