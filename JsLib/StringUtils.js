var CT = CT || {};
CT.StringUtils = CT.StringUtils || {};

CT.StringUtils.split = CT.Utils.curry((delimiter, value) => value.split(delimiter));

CT.StringUtils.toUpper = (value) => value.toUpperCase()

CT.StringUtils.trim = (value) => value.trim();