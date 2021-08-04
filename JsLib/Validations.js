var CT = CT || {};
CT.Validations = CT.Validations || {};

CT.Validations.isAlphaNumeric = CT.Utils.match('/^[A-Za-z0-9]+/ig');

CT.Validations.isPositive = (val) => {
    return Result(Number(val) >= 0,
        CT.Messages.makeMessage(CT.Messages.positive)(val));
}

CT.Validations.isNegative = (val) => {
    return Result(Number(val) < 0,
        CT.Messages.makeMessage(CT.Messages.positive)(val));
}

CT.Validations.isLessThanOrEqualTo = CT.Utils.curry((val, limit) => Number(val) <= limit);

CT.Validations.isInRange = CT.Utils.curry((min, max, val) => {
    return Result((Number(val) >= min && Number(val) <= max),
        CT.Messages.makeMessage(CT.Messages.range)(val, min, max));
});

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