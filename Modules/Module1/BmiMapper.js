'use strict'

const BmiMapper = () => {

    const heightInCms = [142.2, 144.7, 147.3, 149.8, 152.4, 154.9, 157.4, 160.0, 162.5,
        165.1, 167.6, 170.1, 172.7, 175.2, 177.8, 180.3, 182.8, 185.4, 187.9, 190.5,
        193.0, 195.5, 198.1, 200.6, 203.2, 205.7, 208.2, 210.8]

    let heightInFtInch = []

    // in kgs
    const weightInKgs = [41, 45, 50, 54, 59, 64, 68, 73, 77, 82, 86, 91, 95, 100, 104,
        109, 113, 118, 122, 127, 132]

    let weightInLbs = []

    let bmiTable = []

    const calculateBmi = (weight, height) => Math.round((weight * 10000) / (height * height));

    const cmsToInches = (height) => {
        const heightInches = height / 2.54
        const heightInFeet = Math.floor(heightInches / 12)
        const factorInc = heightInches - 12 * heightInFeet
        return `${heightInFeet}' ${Math.round((factorInc + Number.EPSILON) * 10) / 10}''`
    }

    (() => {
        heightInFtInch = heightInCms.map(h => cmsToInches(h))
        weightInLbs = weightInKgs.map(w => Math.round(w * 2.20462))

        bmiTable = heightInCms.map(h => weightInKgs.map(w => calculateBmi(w, h)))
        bmiTable.forEach((bmiRow, idx) => bmiRow.splice(0, 0, heightInCms[idx]))
        bmiTable.forEach((bmiRow, idx) => bmiRow.splice(1, 0, heightInFtInch[idx]))

        bmiTable.splice(0, 0, [' ', ' ', ...weightInLbs])
        bmiTable.splice(1, 0, [' ', ' ', ...weightInKgs])
        bmiTable.splice(2, 0, Array(23).fill(' '))

        bmiTable[0][1] = 'lbs'
        bmiTable[1][1] = 'kg'
        bmiTable[2][0] = 'cm'
        bmiTable[2][1] = 'ft/in'
    })()

    // const getBmiColumnInfo = () => weight.map((w, i) => {
    //     const colName = `c${i}`
    //     return { field: colName, title: colName, width: '30px'}
    // })

    const getBmiGridData = () => {
        return CT.GridUtils.populate(bmiTable)
    }

    return { getBmiGridData, calculateBmi }
}