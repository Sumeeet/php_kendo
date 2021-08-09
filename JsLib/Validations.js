var CT = CT || {};
CT.Validations = CT.Validations || {};

CT.Validations.isAlphaNumeric = CT.Utils.match('/^[A-Za-z0-9]+/ig');

CT.Validations.isNumber = (val) => isNaN(val) ?
    CT.Utils.left('Please enter a valid number') :
    Either.of(Number(val));

CT.Validations.isPositive = (val) => (Number(val) >= 0) ? Either.of(Number(val)) :
    CT.Utils.left('Please enter a positive number');

CT.Validations.isNegative = (val) => (Number(val) < 0) ? Either.of(Number(val)) :
    CT.Utils.left('Please enter a negative number');

CT.Validations.isLessThanOrEqualTo = CT.Utils.curry((val, limit) => Number(val) <= limit);

CT.Validations.isInRange = CT.Utils.curry((min, max, val) => (val >= min && val <= max) ?
    Either.of(val) :
    CT.Utils.left(`Please enter a number in the range ${min} to ${max}`));

CT.Validations.isStringEqual = CT.Utils.compose((orgVal, val, prop) => {
    return Result(orgVal === val,
        CT.Messages.makeMessage(CT.Messages.unEqual)(orgVal, val, prop));
});

CT.Validations.isNumberEqual = CT.Utils.compose((orgVal, val, prop) => {
    return Result((Number(orgVal) - Number(val)) === 0,
        CT.Messages.makeMessage(CT.Messages.unEqual)(orgVal, val, prop));
});

CT.Validations.isArrayEqual = CT.Utils.compose((orgVal, val, prop) => {
    if (!Array.isArray(orgVal) || !Array.isArray(orgVal)) {
        return Result(true, 'Values compared are not an array');
    }

    if (orgVal.length !== val.length) {
        return Result(true,
            CT.Messages.makeMessage(CT.Messages.unEqualArrayLength)());
    }

    const result = Result(false);
    const unequalFunc = CT.Messages.makeMessage(CT.Messages.unEqual);
    orgVal.forEach((v, i) => {
        if (v !== val[i]) {
            result.pushMessage(unequalFunc(v, val[i], prop));
        }
    })

    result.setPass(result.getMessages().length > 0);
    return result
});