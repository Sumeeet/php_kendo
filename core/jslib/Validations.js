var CT = CT || {};
CT.Validations = CT.Validations || {};

CT.Validations.isMatch = CT.Utils.curry((regx, str) =>
  str.test(regx)
    ? Either.of(str)
    : CT.Utils.left(`${str} did not match the regular expression  ${regx}`)
);

CT.Validations.isAlphaNumeric = CT.Validations.isMatch("/^[A-Za-z0-9]+/ig");

CT.Validations.isNumber = CT.Utils.curry((msg, val) =>
  isNaN(val) ? CT.Utils.left(msg) : Either.of(Number(val))
);

CT.Validations.isString = CT.Utils.curry((msg, val) =>
  typeof val !== "string" ? CT.Utils.left(msg) : Either.of(val)
);

CT.Validations.isNull = CT.Utils.curry((msg, val) =>
  typeof val === "undefined" || val === null || val === ""
    ? CT.Utils.left(msg)
    : Either.of(val)
);

CT.Validations.isPositive = CT.Utils.curry((msg, val) =>
  Number(val) >= 0 ? Either.of(Number(val)) : CT.Utils.left(msg)
);

CT.Validations.isInRange = CT.Utils.curry((min, max, val) =>
  val >= min && val <= max
    ? Either.of(val)
    : CT.Utils.left(`Please enter a number in the range of ${min} to ${max}`)
);

CT.Validations.isStringEqual = CT.Utils.curry((prop, orgVal, val) =>
  orgVal === val
    ? Either.of(val)
    : CT.Utils.left(`${prop} changed: ${orgVal} -> ${val}`)
);

CT.Validations.isNumberEqual = CT.Utils.curry((prop, orgVal, val) =>
  Number(orgVal) === Number(val)
    ? Either.of(Number(val))
    : CT.Utils.left(`${prop} changed: ${orgVal} -> ${val}`)
);

CT.Validations.ifExist = CT.Utils.curry((msg, c, val) =>
  val.indexOf(c) < 0 ? CT.Utils.left(msg) : Either.of(val)
);

CT.Validations.compare = CT.Utils.curry((msg, compFunc, val0, val1) =>
  compFunc(val0, val1) ? CT.Utils.left(`${msg}`) : Either.of(val0)
);

CT.Validations.fetchAndCompare = CT.Utils.curry(
  (msg, compFunc, getFunc, val0) =>
    compFunc(getFunc(), val0) ? CT.Utils.left(msg) : Either.of(val0)
);

CT.Validations.compareProp = CT.Utils.curry(
  (msg, compFunc, prop0, prop1, data) => {
    const getData = CT.Utils.curry((prop, data) => data[prop]);
    const fetchCmp = CT.Utils.curry((getData0, getData1, data) => {
      const val0 = getData0(data);
      const val1 = getData1(data);
      return compFunc(val0, val1) ? CT.Utils.left(`${msg}`) : Either.of(data);
    });

    const cmp = CT.Utils.compose(
      CT.Utils.chain(fetchCmp(getData(prop0), getData(prop1))),
      CT.Utils.chain(CT.Utils.propExist("Property does not exist", prop1)),
      CT.Utils.propExist("Property does not exist", prop0)
    );

    return cmp(data);
  }
);
