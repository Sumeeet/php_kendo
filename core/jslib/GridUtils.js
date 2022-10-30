var CT = CT || {};
CT.GridUtils = CT.GridUtils || {};

CT.GridUtils.getColumnNames = (gridInfo) => {
    const colNames = CT.Utils.curry((key, colsInfo) => colsInfo.map((colInfo) => colInfo['field']))
    const getNames = CT.Utils.compose(
        CT.Utils.chain(colNames('field')),
        Maybe.of
    )

    return getNames(gridInfo)
}

CT.GridUtils.populate = (data, colsName = null) => {
    const u = CT.Utils
    const createRow = u.curry((rowData) => {
        const row = {}
        rowData.forEach((value, i) => row[colsName === null ? `col${i}` : colsName[i] ?? `col${i}`] = value)
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

CT.GridUtils.hasData = (gridId) => {
    const execute = CT.Utils.compose(
        CT.Utils.chain((grid => grid.dataSource.data().length > 0)),
        Maybe.of,
        CT.GridUtils.getGrid)
    return execute(gridId)
}

CT.GridUtils.getData = (gridId) => {
    const readItems = (grid) => grid.dataSource.data().length > 0 ? grid.items() : null
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

CT.GridUtils.getSelectedRow = (gridId) => {
    const select = (grid) => grid.select()
    const selectedRow = CT.Utils.compose(
        CT.Utils.chain(select),
        Maybe.of,
        CT.GridUtils.getGrid
    )
    return selectedRow(gridId)
}

CT.GridUtils.getSelectedRowIndex = (gridId) => {
    const selectedRowIndex = CT.Utils.compose(
        (row) => row.index(),
        CT.GridUtils.getSelectedRow
    )
    return selectedRowIndex(gridId)
}

CT.GridUtils.isRowSelected = CT.Utils.curry((gridId) => CT.GridUtils.getSelectedRowIndex(gridId) > -1)

CT.GridUtils.selectRow = CT.Utils.curry((gridId, index) => {
    const execute = CT.Utils.compose(
        CT.Utils.chain((grid) => {
            grid.select(`tr:eq(${index})`)
            return index
        }),
        Maybe.of,
        CT.GridUtils.getGrid
    )
    return execute(gridId)
})

CT.GridUtils.checkRange = (start, end) => {
    if (start > end) return [end, start]
    return [start, end]
}

CT.GridUtils.getRowSelector = (start, end) => `tr:nth-child(n+${start}):nth-child(-n+${end})`

CT.GridUtils.getColumnSelector = (start, end) => `td:nth-child(n+${start}):nth-child(-n+${end})`

CT.GridUtils.filter = CT.Utils.curry((selector, data) => $(data).filter(selector))

CT.GridUtils.map = CT.Utils.curry((func, data) => $.map(data, item => func(item)))

CT.GridUtils.each = CT.Utils.curry((func, data) => $.each(data, func))

CT.GridUtils.readRows = CT.Utils.curry((rs, re, data) => {
    // -1 indicates all rows
    const [s, e] = CT.GridUtils.checkRange(rs, re === -1 ? data.length : re)
    const selector = CT.GridUtils.getRowSelector(s, e)
    const execute = CT.Utils.compose(
        CT.Utils.chain(CT.GridUtils.filter(selector)),
        Maybe.of)
    return execute(data)
})

CT.GridUtils.readGridColumn = CT.Utils.curry((rs, re, cs, ce, gridId) => {
    [cs, ce] = CT.GridUtils.checkRange(cs, ce)
    const selector = CT.GridUtils.getColumnSelector(cs, ce)

    const rowsToCols = (rows) => {
        const cols = []
        $.each(rows[0], () => cols.push([]))
        rows.forEach((row) => $(row).each((i, c) => cols[i].push(c)))
        return cols
    }

    const read = CT.Utils.compose(
        rowsToCols,
        CT.GridUtils.map(
            CT.Utils.compose(CT.GridUtils.filter(selector), (item) => item.cells)
        ),
        CT.GridUtils.readRows(rs, re))

    const execute = CT.Utils.compose(
        CT.Utils.chain(read),
        Maybe.of,
        CT.GridUtils.getData)

    return execute(gridId)
})

CT.GridUtils.readGridRow = CT.Utils.curry((rs, re, cs, ce, gridId) => {
    [cs, ce] = CT.GridUtils.checkRange(cs, ce)
    const selector = CT.GridUtils.getColumnSelector(cs, ce)

    const read = CT.Utils.compose(
        CT.Utils.map(row => [...row]),
        CT.GridUtils.map(
            CT.Utils.compose(CT.GridUtils.filter(selector), (item) => item.cells)
        ),
        CT.GridUtils.readRows(rs, re)
    )

    const execute = CT.Utils.compose(
        CT.Utils.chain(read),
        Maybe.of,
        CT.GridUtils.getData
    )

    return execute(gridId)
})

CT.GridUtils.getRowInsertionIndex = CT.Utils.curry((ds, pos, si) => {
    const rowCount = ds.total()
    if (si === -1) return rowCount

    if (si > rowCount) return rowCount

    if (pos === CELL_INSERTION_POSITION.start) return 0
    if (pos === CELL_INSERTION_POSITION.end) return rowCount
    if (pos === CELL_INSERTION_POSITION.before) return si
    if (pos === CELL_INSERTION_POSITION.after) return Math.max(si, si + 1)
})

CT.GridUtils.addRow = CT.Utils.curry((position, gridId) => {
    const insert = CT.Utils.curry(function (source, index) {
        // TODO: copy first item if any, later on will add blank, default or user defined values
        // const sourceData = source.data()
        // const rowCopy = Object.assign({}, rowCount > 0 ? sourceData[0] : {})
        source.insert(index, { checked: false, fage: 10, sage: 10 })
        console.log(`row added at index: ${index}`)
        return index
    })

    const dataSource = CT.GridUtils.getSource(gridId)
    const execute = CT.Utils.compose(
        CT.GridUtils.selectRow(gridId),
        insert(dataSource),
        CT.GridUtils.getRowInsertionIndex(dataSource, position),
        CT.GridUtils.getSelectedRowIndex,
    )
    return execute(gridId)
})

CT.GridUtils.addRowAt = CT.Utils.curry((index, gridId) => {
    const insert = CT.Utils.curry(function (source, index) {
        // TODO: copy first item if any, later on will add blank, default or user defined values
        // const sourceData = source.data()
        // const rowCopy = Object.assign({}, rowCount > 0 ? sourceData[0] : {})
        source.insert(index, { checked: false, fage: 10, sage: 10 })
        console.log(`row added at index: ${index}`)
        return index
    })

    const dataSource = CT.GridUtils.getSource(gridId)
    const execute = CT.Utils.compose(
        CT.GridUtils.selectRow(gridId),
        insert(dataSource)
    )

    return execute(index)
})

CT.GridUtils.removeRow = CT.Utils.curry((gridId) => {
    const remove = CT.Utils.curry( function(grid, rowCount, index) {
        // remove from the end if nothing is selected
        index = index === -1 ? rowCount - 1 : index
        grid.removeRow(`tbody tr:eq("${index}")`);
        console.log(`row removed at index: ${index}`);
        return index
    })

    const grid = CT.GridUtils.getGrid(gridId)
    const rowCount = grid.dataSource.total()
    const execute = CT.Utils.compose(
        CT.GridUtils.selectRow(gridId),
        (index) => rowCount === index ? index - 1 : index,
        remove(grid, rowCount),
        CT.GridUtils.getSelectedRowIndex
    )

    let selIndex = execute(gridId)
    // we need removed index, restore index
    return rowCount === selIndex ? selIndex + 1 : selIndex
})

CT.GridUtils.removeRowAt = CT.Utils.curry((index, gridId) => {
    const remove = CT.Utils.curry(function (idx, grid) {
        if (idx > 0) {
            grid.removeRow(`tbody tr:eq("${idx}")`)
            console.log(`row removed at index: ${idx}`);
        }
        return idx
    })

    const grid = CT.GridUtils.getGrid(gridId)
    const execute = CT.Utils.compose(
        CT.GridUtils.selectRow(gridId),
        (index) => index - 1,
        CT.Utils.chain(remove(index)),
        Maybe.of,
        CT.GridUtils.getGrid
    )

    // we are selecting next logical row, returned index from selectRow is
    // different from row removed, restore it
    let selIndex = execute(gridId)
    // we need removed index, restore index
    return selIndex + 1
})