var CT = CT || {};
CT.ArrayUtils = CT.ArrayUtils || {};

CT.ArrayUtils.isArray = (val) =>
  Array.isArray(val) ? Either.of(val) : CT.Utils.left(`${val} is not an array`);

CT.ArrayUtils.hasDuplicates = CT.Utils.curry((msg, prop, arr) => {
  const find = CT.Utils.curry((d, e) => (d[e] = (d[e] || 0) + 1));
  const countDuplicates = CT.Utils.curry((duplicates, data) => {
    const count = CT.Utils.compose(
      () => duplicates,
      CT.Utils.chain(CT.Utils.forEach(CT.Utils.chain(find(duplicates)))),
      Maybe.of
    );

    return count(data);
  });

  const execute = CT.Utils.compose(
    (dupValues) =>
      dupValues.length === 0
        ? Either.of(arr)
        : CT.Utils.left(`${msg} ${dupValues}`),
    (d) => Object.keys(d).filter((k) => d[k] > 1),
    countDuplicates({}),
    CT.Utils.map(CT.Utils.getData(prop))
  );
  return execute(arr);
});
