var CT = CT || {};
CT.GridUtils = CT.GridUtils || {};

CT.GridUtils.populate = (data, colInfo = null) => {
    const u = CT.Utils
    const createRow = u.curry((rowData) => {
        const row = {}
        rowData.forEach((value, i) => row[colInfo === null ? `col${i}` : colInfo[i] ?? `col${i}`] = value)
        return row
    })

    const execute = u.compose(
        u.chain(u.map(createRow)),
        Maybe.of
    )

    return execute(data)
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

CT.GridUtils.getSourceData = (gridId) => {
    const read = CT.Utils.compose(
        CT.Utils.chain((grid) => grid.dataSource.data()),
        Maybe.of,
        CT.GridUtils.getGrid)
    return read(gridId)
}

CT.GridUtils.getSource = (gridId) => {
    const read = CT.Utils.compose(
        CT.Utils.chain((grid) => grid.dataSource),
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
    // -1 indicates all rows
    const [s, e] = CT.GridUtils.checkRange(rs, re === -1 ? data.length : re)
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

CT.GridUtils.hasDuplicates = CT.Utils.curry((ci, gridId) => {
    const innerText = CT.Utils.map(e => e.innerText)

    const readData = CT.Utils.compose(
        CT.Utils.map(e => innerText(e)),
        // -1 indicates all rows, starting from index 1 (skip headers or other rows)
        CT.Utils.chain(CT.GridUtils.readColumnWise(4, -1, ci, ci)),
        Maybe.of,
        CT.GridUtils.getData
    )

    const execute = CT.Utils.compose(
        CT.Utils.map(CT.ArrayUtils.hasDuplicates('')),
        readData
    )
    return execute(gridId)
})

CT.GridUtils.addRow = CT.Utils.curry((position, gridId) => {
    const insert = CT.Utils.curry((pos, source) => {
        // TODO: copy first item if any, later on will add blank, default or user defined values
        const rowCount = source.total()
        const sourceData = source.data()
        const rowCopy = Object.assign({}, rowCount > 0 ? sourceData[0] : {})
        source.insert(rowCount, rowCopy)
        console.log(`row added: ${pos}`);
    })

    const execute = CT.Utils.compose(
        CT.Utils.chain(insert(position)),
        Maybe.of,
        CT.GridUtils.getSource
    )

    return execute(gridId)
})

CT.GridUtils.removeRow = CT.Utils.curry((position, gridId) => {
    const remove = CT.Utils.curry((pos, source) => {
        const rowCount = source.total()
        const grid = CT.GridUtils.getGrid(gridId)
        grid.removeRow(`tr:eq("${rowCount}")`);
        console.log(`row removed: ${pos}`);
    })

    const execute = CT.Utils.compose(
        CT.Utils.chain(remove(position)),
        Maybe.of,
        CT.GridUtils.getSource
    )

    return execute(gridId)
})