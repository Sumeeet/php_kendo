const u = CT.Utils
const v = CT.Validations
const su = CT.StringUtils

const chain = u.curry((func, f) => func(f));
splitTrim = u.compose(u.map(su.trim), su.split)

const splitTrimStrings = u.curry((func, delimiter, value) => func(delimiter, value))
const splitTrimBlocks = splitTrimStrings(splitTrim, '+')
const splitTrimVectors = splitTrimStrings(splitTrim, '/')
const splitTrimSetValue = u.mapAt(splitTrimStrings(splitTrim, ':'), 0)

const CalcNofDec = (value) => {
    const fValue = Math.abs(Number(value))
    if (fValue >= 1000) { return 0 }
    if (fValue >= 100) { return 1 }
    if (fValue >= 10) { return 2 }
    if (fValue >= 1) { return 3 }
    if (fValue >= 0.1) { return 4 }
    if (fValue >= 0.01) { return 5 }
    return 6
}

const formatSetValue = (value) => u.toFixed(2, value)

const formatCycleTime = (value) => u.toFixed(1, value)

const formatSetValues = u.curry((index, values) => {
    const evaluate = u.compose(
        u.join(' : '),
        u.mapAt(formatCycleTime, 3),
        u.mapAt(formatCycleTime, 2),
        u.mapAt(formatSetValue, 1),
        u.mapAt(formatSetValue, 0))
    const execute = chain(evaluate)
    values[index] = execute(values[index])
    return values
})

const formatStartTime = (value) => u.toFixed(1, value)

const formatRampRate = (value) => u.toFixed(CalcNofDec(value), value)

const formatCycleInterval = (value) => {
    const evaluate = u.compose(
        su.prepend('#'),
        u.toFixed(0),
        su.findSlice('#'))

    const execute = chain(evaluate)
    return execute(value)
}

function formatValue (str) {
    Log(`Non formatted string: ${str}`)

    const splitTrim = u.compose(
        u.map(splitTrimSetValue),
        u.map(splitTrimVectors),
        splitTrimBlocks)

    const evaluate = chain(u.compose(
        u.join(' / '),
        u.mapAt(formatCycleInterval, 3),
        u.mapAt(formatRampRate, 2),
        u.mapAt(formatStartTime, 1),
        formatSetValues(0)))

    const execute = chain(u.compose(
        u.join(' + '),
        u.map(evaluate),
        splitTrim))

    Log(`formatted string: ${execute(str)}`)
}

const validateCycleTime = u.compose(
    u.chain(v.isPositive('Cycle time must be a positive number')),
    u.chain(v.isNumber('Cycle time must be a number')),
    v.isNull('Cycle time is either empty or not defined'))

const validateSetValue = u.compose(
    u.chain(v.isPositive('Set value must be a positive number')),
    u.chain(v.isNumber('Set value must be a number')),
    v.isNull('Set value is either empty or not defined'))

const validateSetValues =  u.curry((index, values) => {
    const evaluate = u.compose(
        (r) => r.result.flat(Infinity),
        u.concat(u.validateAt(validateCycleTime, 3)),
        u.concat(u.validateAt(validateCycleTime, 2)),
        u.concat(u.validateAt(validateSetValue, 1)),
        u.validateAt(validateSetValue, 0))
    const execute = chain(evaluate)
    return { result: execute(values[index]), orgValue: values }
})

const validateStartTime = u.compose(
    u.chain(v.isPositive('Start time must be a positive number')),
    v.isNumber('Start time must be a number'))


const validateRampRate = u.compose(
    u.chain(v.isPositive('Ramp rate time must be a positive number')),
    v.isNumber('Ramp rate must be a number'))


const validateCycleInterval = u.compose(
    v.ifExist('Invalid Cycle interval, missing # before value', '#'))


function validateValue (str) {
    Log(`Non formatted string: ${str}`)

    const splitTrim = u.compose(
        u.map(splitTrimSetValue),
        u.map(splitTrimVectors),
        splitTrimBlocks)

    const validate = chain(u.compose(
        (r) => r.result.flat(Infinity),
        u.concat(u.validateAt(validateCycleInterval, 3)),
        u.concat(u.validateAt(validateRampRate, 2)),
        u.concat(u.validateAt(validateStartTime, 1)),
        validateSetValues(0)))

    const execute = chain(u.compose(
        u.map(validate),
        splitTrim))

    Log(execute(str))
}