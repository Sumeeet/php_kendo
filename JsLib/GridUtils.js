var CT = CT || {};
CT.GridUtils = CT.GridUtils || {};

CT.GridUtils.Create = (data, colInfo = null) => {
    if (data === null || !Array.isArray(data)) return []

    if (colInfo === null) {
        // generate default column names 'col0', 'col1'....
        return data.map(r => {
            const row = {}
            r.forEach((value, i) => row[`c${i}`] = value)
            return row
        })
    }
}