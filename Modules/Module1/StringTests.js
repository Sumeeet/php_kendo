const chain = CT.Utils.curry((func, f) => func(f));
splitTrim = CT.Utils.compose(CT.Utils.map(CT.StringUtils.trim), CT.StringUtils.split)

const splitTrimStrings = CT.Utils.curry((func, delimiter, value) => func(delimiter, value))
const splitTrimBlocks = splitTrimStrings(splitTrim, '+')
const splitTrimVectors = splitTrimStrings(splitTrim, '/')
const splitTrimSetValue = CT.Utils.mapAt(splitTrimStrings(splitTrim, ':'), 0)

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

const formatSetValue = (value) => CT.Utils.toFixed(2, value)

const formatCycleTime = (value) => CT.Utils.toFixed(1, value)

const formatSetValues = CT.Utils.curry((index, values) => {
    const evaluate = CT.Utils.compose(
        CT.Utils.join(' : '),
        CT.Utils.mapAt(formatCycleTime, 3),
        CT.Utils.mapAt(formatCycleTime, 2),
        CT.Utils.mapAt(formatSetValue, 1),
        CT.Utils.mapAt(formatSetValue, 0))
    const execute = chain(evaluate)
    values[index] = execute(values[index])
    return values
})

const formatStartTime = (value) => CT.Utils.toFixed(1, value)

const formatRampRate = (value) => CT.Utils.toFixed(CalcNofDec(value), value)

const formatCycleInterval = (value) => {
    const first = value.substr(0, 1)
    if (first === '#') {
        // Remove #
        value = value.substr(1)
    }
    return '#' + CT.Utils.toFixed(0, value)
}

function formatValue (str) {
    console.log(`Non formatted string: ${str}`)

    const splitTrim = CT.Utils.compose(
        CT.Utils.map(splitTrimSetValue),
        CT.Utils.map(splitTrimVectors),
        splitTrimBlocks)

    const evaluate = chain(CT.Utils.compose(
        CT.Utils.join(' / '),
        CT.Utils.mapAt(formatCycleInterval, 3),
        CT.Utils.mapAt(formatRampRate, 2),
        CT.Utils.mapAt(formatStartTime, 1),
        formatSetValues(0)))

    const execute = chain(CT.Utils.compose(
        CT.Utils.join(' + '),
        CT.Utils.map(evaluate),
        splitTrim))

    console.log(`formatted string: ${execute(str)}`)
}

// const validateSetValues = CT.Utils.curry((index, values) => {
//     const evaluate = CT.Utils.compose(
//         CT.Utils.ifSomething(formatCycleTime, 3),
//         CT.Utils.ifSomething(formatCycleTime, 2),
//         CT.Utils.ifSomething(formatSetValue, 1),
//         CT.Utils.ifSomething(formatSetValue, 0))
//     const execute = chain(evaluate)
//     values[index] = execute(values[index])
//     return values
// })
//
// function validateValue (str) {
//     console.log(`Non formatted string: ${str}`)
//
//     const splitTrim = CT.Utils.compose(
//         CT.Utils.map(splitTrimSetValue),
//         CT.Utils.map(splitTrimVectors),
//         splitTrimBlocks)
//
//     const evaluate = chain(CT.Utils.compose(
//         CT.Utils.join(' / '),
//         CT.Utils.ifSomething(formatCycleInterval, 3),
//         CT.Utils.ifSomething(formatRampRate, 2),
//         CT.Utils.ifSomething(formatStartTime, 1),
//         formatSetValues(false, 0)))
//
//     const execute = chain(CT.Utils.compose(
//         CT.Utils.join(' + '),
//         CT.Utils.map(evaluate),
//         splitTrim))
//
//     console.log(`formatted string: ${execute(str)}`)
//}