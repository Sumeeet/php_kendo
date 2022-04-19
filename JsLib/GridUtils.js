var CT = CT || {};
CT.GridUtils = CT.GridUtils || {};

CT.GridUtils.create = (data, colInfo = null) => {
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

CT.GridUtils.getGrid = (gridId) => {
    gridId = gridId.indexOf("#") >- 1 ? gridId: `#${gridId}`;
    return $(gridId).data("kendoGrid");
};

CT.GridUtils.hasData = (grid) => grid.dataSource.data().length > 0

CT.GridUtils.getData = (gridId) => {
    const readItems = (grid) => CT.GridUtils.hasData(grid) ? grid.items() : null
    const read = CT.Utils.compose(
        CT.Utils.chain(readItems),
        Maybe.of,
        CT.GridUtils.getGrid)
    return read(gridId)
}

CT.GridUtils.checkRange = (start, end) => {
    if (start > end) return [end, start]
    return [start, end]
}

CT.GridUtils.filter = CT.Utils.curry((selector, data) => $(data).filter(selector))

CT.GridUtils.map = CT.Utils.curry((func, data) => $.map(data, item => func(item.cells)))

CT.GridUtils.each = CT.Utils.curry((func, data) => $.each(data, func))

CT.GridUtils.readRows = CT.Utils.curry((rs, re, data) => {
    const [s, e] = CT.GridUtils.checkRange(rs, re)
    const selector = `tr:nth-child(n+${s}):nth-child(-n+${e})`;
    const execute = CT.Utils.compose(CT.Utils.chain(CT.GridUtils.filter(selector)), Maybe.of)
    return execute(data)
})

CT.GridUtils.readColumnWise = CT.Utils.curry((rs, re, cs, ce, data) => {
    [cs, ce] = CT.GridUtils.checkRange(cs, ce)
    const selector = `td:nth-child(n+${cs}):nth-child(-n+${ce})`

    const rowsToCols = (rows) => {
        const cols = []
        $.each(rows[0], () => cols.push([]))
        rows.forEach((row) => $(row).each((i, c) => cols[i].push(c)))
        return cols
    }

    const read = CT.Utils.compose(
        rowsToCols,
        CT.GridUtils.map(CT.GridUtils.filter(selector)),
        CT.GridUtils.readRows(rs, re))

    const execute = CT.Utils.compose(
        CT.Utils.chain(read),
        Maybe.of)

    return execute(data)
})

CT.GridUtils.readRowWise = CT.Utils.curry((rs, re, cs, ce, data) => {
    [cs, ce] = CT.GridUtils.checkRange(cs, ce)
    const selector = `td:nth-child(n+${cs}):nth-child(-n+${ce})`

    const read = CT.Utils.compose(
        CT.Utils.map(row => [...row]),
        CT.GridUtils.map(CT.GridUtils.filter(selector)),
        CT.GridUtils.readRows(rs, re)
    )

    const execute = CT.Utils.compose(
        CT.Utils.chain(read),
        Maybe.of
    )

    return execute(data)
})

// CT.GridUtils.contains = CT.Utils.curry((master, data) => {
//     const innerText = CT.Utils.map(e => e.innerText)
//
//     const subSet = CT.Utils.compose(
//         CT.Utils.contains(master),
//         CT.Utils.map(subData => innerText(subData))
//     )
//
//     const execute = CT.Utils.compose(
//         CT.Utils.map(subSet),
//         Maybe.of
//     )
//     return execute(data)
// })