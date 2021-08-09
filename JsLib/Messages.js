var CT = CT || {};
CT.Messages = CT.Messages || {};

CT.Messages.makeMessage = (fn) => {
    return function(...args) {
        return fn.apply(this, args);
    }
}

CT.Messages.unEqual = CT.Utils.compose((orgValue, value, property) =>
    `${property} changed: ${orgValue} -> ${value}`);

CT.Messages.unEqualArrayLength = CT.Utils.compose((orgValue, value) =>
    `Array length has changed from ${orgValue.length} -> ${value.length}`);

CT.Messages.positive = CT.Utils.compose((value) =>
    'value should be greater than equal to 0');

CT.Messages.negative = CT.Utils.compose((value) =>
    'value should be less than 0');

CT.Messages.range = CT.Utils.compose((value, min, max) =>
    `value should be within ${min} and ${max}`);