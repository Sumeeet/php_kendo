'use strict'

const BmiMapper = () => {
    // in cms
    const height = [142.2, 144.7, 147.3, 149.8, 152.4, 154.9, 157.4, 160.0, 162.5,
        165.1, 167.6, 170.1, 172.7, 175.2, 177.8, 180.3, 182.8, 185.4, 187.9, 190.5,
        193.0, 195.5, 198.1, 200.6, 203.2, 205.7, 208.2, 210.8]

    // in kgs
    const weight = [41, 45, 50, 54, 59, 64, 68, 73, 77, 82, 86, 91, 95, 100, 104,
        109, 113, 118, 122, 127, 132]

    let bmiTable = []

    const CalculateBmi = (weight, height) => Math.round((weight * 10000) / (height * height));

    (() => {
        bmiTable = height.map(h => weight.map(w => CalculateBmi(w, h)))
    })()

    // const getBmiColumnInfo = () => weight.map((w, i) => {
    //     const colName = `c${i}`
    //     return { field: colName, title: colName, width: '30px'}
    // })

    const getBmiGridData = () =>
        bmiTable.map(r => {
            const row = {}
            r.forEach((bmi, i) => row[`c${i}`] = bmi)
            return row
        })

    return { getBmiGridData }
}