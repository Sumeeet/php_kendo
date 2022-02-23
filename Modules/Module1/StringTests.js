const chain = CT.Utils.curry((func, functor) => func(functor));
splitTrim = CT.Utils.compose(CT.Utils.map(CT.StringUtils.trim), CT.StringUtils.split)

const splitTrimStrings = CT.Utils.curry((func, delimiter, value) => func(delimiter, value))
const splitTrimBlocks = splitTrimStrings(splitTrim, '+')
const splitTrimVectors = splitTrimStrings(splitTrim, '/')
const splitTrimSetValue = CT.Utils.compose(CT.Utils.mapFirstN(splitTrimStrings(splitTrim, ':'), 1))

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

const formatSetValue = (index, values) => {
    values[index] = CT.Utils.toFixed(2, values[index])
    return values
}

const formatCycleTime = (index, values) => {
    values[index] = CT.Utils.toFixed(1, values[index])
    return values
}

const formatSetValues = CT.Utils.curry((index, values) => {
    const evaluate = CT.Utils.compose(CT.Utils.join(' : '),
        CT.Utils.ifNotNull(formatCycleTime, 3),
        CT.Utils.ifNotNull(formatCycleTime, 2),
        CT.Utils.ifNotNull(formatSetValue, 1),
        CT.Utils.ifNotNull(formatSetValue, 0))
    const execute = chain(evaluate)
    values[index] = execute(values[index])
    return values
})

const formatStartTime = (index, values) => {
    values[index] = CT.Utils.toFixed(1, values[index])
    return values
}

const formatRampRate = (index, values) => {
    let value = values[index]
    values[index] = CT.Utils.toFixed(CalcNofDec(value), value)
    return values
}

const formatCycleInterval = (index, values) => {
    let value = values[index]
    const first = value.substr(0, 1)
    if (first === '#') {
        // Remove #
        value = value.substr(1)
    }
    values[index] = '#' + CT.Utils.toFixed(0, value)
    return values
}

function formatValue (str) {
    console.log(`Non formatted string: ${str}`)

    const splitTrim = CT.Utils.compose(
        CT.Utils.map(splitTrimSetValue),
        CT.Utils.map(splitTrimVectors),
        splitTrimBlocks)

    const evaluate = chain(CT.Utils.compose(
        CT.Utils.join(' / '),
        CT.Utils.ifNotNull(formatCycleInterval, 3),
        CT.Utils.ifNotNull(formatRampRate, 2),
        CT.Utils.ifNotNull(formatStartTime, 1),
        formatSetValues(0)))

    const execute = chain(CT.Utils.compose(
        CT.Utils.join(' + '),
        CT.Utils.map(evaluate),
        splitTrim))

    console.log(`formatted string: ${execute(str)}`)
}