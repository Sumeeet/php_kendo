var CT = CT || {};
CT.StringUtils = CT.StringUtils || {};

CT.StringUtils.split = CT.Utils.curry((delimiter, value) => value.split(delimiter));

CT.StringUtils.toUpper = (value) => value.toUpperCase()

CT.StringUtils.trim = (value) => value.trim();

CT.StringUtils.subString = CT.Utils.curry((s, v) => v.substr(s))

CT.StringUtils.prepend = CT.Utils.curry((s, v) => s + v)