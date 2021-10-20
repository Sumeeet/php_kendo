var CT = CT || {};
CT.Validations = CT.Validations || {};

CT.Validations.isMatch = CT.Utils.curry((regx, str) =>
    str.test(regx) ? Either.of(str) :
        CT.Utils.left(`${str} did not match the regular expression  ${regx}`));

CT.Validations.isAlphaNumeric = CT.Validations.isMatch('/^[A-Za-z0-9]+/ig');

CT.Validations.isNumber = (val) =>
    isNaN(val) ? CT.Utils.left('Please enter a valid number') :
        Either.of(Number(val));

CT.Validations.isString = (val) =>
    typeof val !== 'string' ? CT.Utils.left('Please enter a valid string') :
        Either.of(val);

CT.Validations.isNull = (val) =>
    typeof val === 'undefined' || val === null || val === '' ? CT.Utils.left('Field cannot be blank.') :
        Either.of(val);

CT.Validations.isPositive = (val) =>
    (Number(val) >= 0) ? Either.of(Number(val)) :
        CT.Utils.left('Please enter a positive number');

CT.Validations.isInRange = CT.Utils.curry((min, max, val) =>
    (val >= min && val <= max) ? Either.of(val) :
        CT.Utils.left(`Please enter a number in the range ${min} to ${max}`));

CT.Validations.isStringEqual = CT.Utils.curry((prop, orgVal, val) =>
    (orgVal === val) ? Either.of(val) :
        CT.Utils.left(`${prop} changed: ${orgVal} -> ${val}`));

CT.Validations.isNumberEqual = CT.Utils.curry((prop, orgVal, val) =>
    (Number(orgVal) === Number(val)) ? Either.of(Number(val)) :
        CT.Utils.left(`${prop} changed: ${orgVal} -> ${val}`));