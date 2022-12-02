var CT = CT || {};
CT.Utils = CT.Utils || {};

CT.Utils.compose =
  (...fns) =>
  (...args) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

CT.Utils.asyncCompose =
  (...fn) =>
  (...args) =>
    fn.reduceRight((chain, func) => chain.then(func), Promise.resolve(args));

CT.Utils.curry = (fn) => {
  const arity = fn.length;
  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }
    return fn.call(null, ...args);
  };
};

CT.Utils.forEach = CT.Utils.curry((func, functor) =>
  functor.forEach((e, i) => func(e, i))
);

//CT.Utils.forEachFill = CT.Utils.curry((obj, func, functor) => functor.forEach((e, i) => func(obj, e, i)));

CT.Utils.reduce = CT.Utils.curry((func, initialValue, functor) =>
  functor.reduce(func, initialValue)
);

CT.Utils.map = CT.Utils.curry((func, functor) => functor.map(func));

CT.Utils.chain = CT.Utils.curry((func, m) => m.chain(func));

CT.Utils.join = CT.Utils.curry((delimiter, functor) => functor.join(delimiter));

CT.Utils.match = CT.Utils.curry((regx, str) => str.match(regx) !== null);

CT.Utils.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

CT.Utils.left = (x) => new Left(x);

CT.Utils.identity = (x) => x;

CT.Utils.either = CT.Utils.curry((f, g, e) => {
  switch (e.constructor) {
    case Left:
      return new Message(MESSAGE_TYPE.error, "client", f(e.$val));
    case Right:
      return new Message(MESSAGE_TYPE.debug, "client", `value ${g(e.$val)}`);
    case Array:
      // already evaluated
      return e;
    default:
      throw new Error("Unknown result type");
  }
});

CT.Utils.toFixed = CT.Utils.curry((decimals, value) =>
  Number(value).toFixed(decimals)
);

// mutate values in array v
CT.Utils.mapAt = CT.Utils.curry((f, i, v) => {
  const something = CT.Utils.compose(CT.Utils.map(f), Maybe.of);
  const maybe = something(v[i]);
  if (!maybe.isNothing) v[i] = maybe.join();
  return v;
});

CT.Utils.validateAt = CT.Utils.curry((f, i, v) => {
  const something = CT.Utils.compose(CT.Utils.chain(f), Either.of);
  const result = something(v[i]);
  return { result: result, orgValue: v };
});

// TODO: very confusing, clean it
CT.Utils.concat = CT.Utils.curry((f, r) => {
  const result = f(r.orgValue);
  const results = [r.result, result.result];
  return { result: results, orgValue: r.orgValue };
});

CT.Utils.sort = CT.Utils.curry((func, functor) => functor.sort(func));

CT.Utils.updateError = CT.Utils.curry((id, result) => {
  try {
    const element = document.getElementById(id);
    element.innerText = result.pass ? "" : result.message;
  } catch (e) {
    console.error(`Unable to locate DOM element for ID '${id}'. ${e}`);
  }
});

CT.Utils.IfElse = CT.Utils.curry((cond, func1, func2, v) =>
  cond(v) ? func1(v) : func2(v)
);

CT.Utils.filter = CT.Utils.curry((func, functor) => functor.filter(func));

CT.Utils.flatten = CT.Utils.curry((arr) => [].concat(...arr));

CT.Utils.getSafeData = CT.Utils.curry((prop, obj) => {
  const getData = CT.Utils.compose(
    CT.Utils.chain((data) => data[prop]),
    CT.Utils.chain(CT.Utils.propExist("Property does not exist", prop)),
    Maybe.of
  );
  return getData(obj);
});

CT.Utils.getSafeDataA = CT.Utils.curry((propLike, obj) => {
  // search for all the object prop which matches propLike regular expression
  const getSafeData = CT.Utils.curry((data, prop) =>
    CT.Utils.getSafeData(prop, data)
  );

  const execute = CT.Utils.compose(
    CT.Utils.map(getSafeData(obj)),
    CT.Utils.filter(CT.StringUtils.match(propLike)),
    Object.keys
  );
  return execute(obj);
});

CT.Utils.safeDelete = CT.Utils.curry((prop, obj) => {
  const deletProp = CT.Utils.compose(
    CT.Utils.chain((data) => delete data[`${prop}`]),
    CT.Utils.chain(CT.Utils.propExist("Property does not exist", prop)),
    Maybe.of
  );

  deletProp(obj);
});

CT.Utils.safeDeleteA = CT.Utils.curry((propLike, obj) => {
  // search for all the object prop which matches propLike regular expression
  const deleteSafeProp = CT.Utils.curry((data, prop) =>
    CT.Utils.safeDelete(prop, data)
  );

  const deletProp = CT.Utils.compose(
    CT.Utils.map(deleteSafeProp(obj)),
    CT.Utils.filter(CT.StringUtils.match(propLike)),
    Object.keys
  );
  deletProp(obj);
});

CT.Utils.getSafeIndexA = CT.Utils.curry((pred, obj) => {
  const scanColumns = CT.Utils.curry((colData, ci) =>
    pred(colData) ? ci : undefined
  );

  const scanRows = (rowData) => {
    return CT.Utils.compose(
      CT.Utils.filter(pred),
      CT.Utils.map(scanColumns),
      CT.Utils.getSafeDataA(COLUMN_REGEX) // return values for all the matching properties
    )(rowData);
  };

  return CT.Utils.map(scanRows, obj);
});

CT.Utils.safeAssign = CT.Utils.curry((from, to, prop) => {
  const toCopy = Object.assign({}, from);
  const assign = CT.Utils.compose(
    CT.Utils.forEach((key) => (toCopy[key] = from[key])),
    Object.keys
  );
  const execute = CT.Utils.compose(
    CT.Utils.chain(assign),
    CT.Utils.propExist("Property does not exist", prop)
  );
  execute(from);
  return toCopy;
});

CT.Utils.propExist = CT.Utils.curry((msg, prop, data) =>
  Object.hasOwn(data, prop) ? Either.of(data) : CT.Utils.left(`${msg}: ${prop}`)
);

CT.Utils.chainAndCompose = (fns) => {
  const last = fns.pop();
  let chainedFuncs = fns.map((fn) => CT.Utils.chain(fn));
  if (last) {
    chainedFuncs.push(last);
  }
  chainedFuncs.splice(
    0,
    0,
    CT.Utils.either(CT.Utils.identity, CT.Utils.identity)
  );
  return CT.Utils.compose(...chainedFuncs);
};

CT.Utils.LoadTemplates = (paths) => {
  const loadTemplate = CT.Utils.curry((options, path) => fetch(path));

  const awaitLoadTemplates = (loadTemplatesFunc) => {
    return Promise.all(loadTemplatesFunc)
      .then((response) => response[0].text())
      .catch((e) =>
        Log(`There has been a problem with loading templates : ${e.message}`)
      );
  };

  const execute = CT.Utils.compose(
    awaitLoadTemplates,
    CT.Utils.chain(CT.Utils.map(loadTemplate({ method: "GET" }))),
    Maybe.of
  );

  return execute(paths);
};

CT.Utils.isUndefined = (obj) => obj === null || obj === undefined || obj === "";

CT.Utils.isDefined = (obj) => !CT.Utils.isUndefined(obj);

CT.Utils.makeShortCutKey = (e) =>
  (e.ctrlKey ? "ctrl " : "") +
  (e.shiftKey ? "shift " : "") +
  (e.altKey ? "alt " : "") +
  e.key.toLowerCase();
