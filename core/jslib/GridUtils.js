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
    const selectRow = CT.Utils.compose(
        CT.Utils.chain(select),
        Maybe.of,
        CT.GridUtils.getGrid
    )
    return selectRow(gridId)
}

CT.GridUtils.getSelectedRowIndex = (gridId) => {
    const selectedIndex = (row) => row.index()
    const selectedRowIndex = CT.Utils.compose(
        selectedIndex,
        CT.GridUtils.getSelectedRow
    )
    return selectedRowIndex(gridId)
}

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
        si = Math.max(0, si === -1 ? rowCount - 1 : si)
        si = Math.min(si, rowCount)
        if (pos === CELL_INSERTION_POSITION.start) return 0
        if (pos === CELL_INSERTION_POSITION.end) return rowCount
        if (pos === CELL_INSERTION_POSITION.before) return si
        if (pos === CELL_INSERTION_POSITION.after) return Math.max(si, si + 1)
})

CT.GridUtils.addRow = CT.Utils.curry((position, gridId) => {
    const insert = CT.Utils.curry((source, index) => {
        // TODO: copy first item if any, later on will add blank, default or user defined values
        // const sourceData = source.data()
        // const rowCopy = Object.assign({}, rowCount > 0 ? sourceData[0] : {})
        source.insert(index, { checked: false, fage: 10, sage: 10 })
        console.log(`row added at index: ${index}`)
        return index
    })

    const dataSource = CT.GridUtils.getSource(gridId)
    const execute = CT.Utils.compose(
        insert(dataSource),
        CT.GridUtils.getRowInsertionIndex(dataSource, position),
        CT.GridUtils.getSelectedRowIndex,
    )
    return execute(gridId)
})

CT.GridUtils.addRowAt = CT.Utils.curry((index, gridId) => {
    const insert = CT.Utils.curry((source, index) => {
        // TODO: copy first item if any, later on will add blank, default or user defined values
        // const sourceData = source.data()
        // const rowCopy = Object.assign({}, rowCount > 0 ? sourceData[0] : {})
        source.insert(index, { checked: false, fage: 10, sage: 10 })
        console.log(`row added at index: ${index}`)
        return index
    })

    const dataSource = CT.GridUtils.getSource(gridId)

    return insert(dataSource, index)
})

CT.GridUtils.removeRow = CT.Utils.curry((position, gridId) => {
    const remove = CT.Utils.curry((pos, grid) => {
        const rowCount = grid.dataSource.total()
        // TODO: get index from position constant
        if (rowCount > 0) {
            const row = CT.GridUtils.getRowSelector(rowCount, rowCount)
            grid.removeRow(`tr:eq("${rowCount}")`);
            console.log(`row removed at index: ${pos}`);
        }
        return rowCount
    })

    const execute = CT.Utils.compose(
        CT.Utils.chain(remove(position)),
        Maybe.of,
        CT.GridUtils.getGrid
    )

    return execute(gridId)
})

CT.GridUtils.removeRowAt = CT.Utils.curry((index, gridId) => {
    const remove = CT.Utils.curry((idx, source) => {
        const rowCount = source.total()
        const grid = CT.GridUtils.getGrid(gridId)
        // TODO: get index from position constant
        if (rowCount > 0) {
            const row = CT.GridUtils.getRowSelector(idx, idx)
            grid.removeRow(row)//`tr:eq("${rowCount}")`);
            console.log(`row removed at index: ${idx}`);
        }
    })

    const execute = CT.Utils.compose(
        CT.Utils.chain(remove(index)),
        Maybe.of,
        CT.GridUtils.getSource
    )

    return execute(gridId)
})