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

CT.GridUtils.hasData = (gridId) => {
    const grid = CT.GridUtils.getGrid(gridId);
    return grid.dataSource.data().length > 0;
};

CT.GridUtils.checkRange = (start, end) => {
    if (start > end) return [end, start]
    return [start, end]
}

CT.GridUtils.read = CT.Utils.curry((selector, data) => $(data).filter(selector))

CT.GridUtils.map = CT.Utils.curry((func, data) => $.map(data, item => func(item.cells)))

CT.GridUtils.readRows = CT.Utils.curry((start, end, data) => {
    const [rs, re] = CT.GridUtils.checkRange(start, end)
    const selector = `tr:nth-child(n+${rs}):nth-child(-n+${re})`;
    const execute = CT.Utils.compose(CT.Utils.chain(CT.GridUtils.read(selector)), Maybe.of)
    return execute(data)
})

CT.GridUtils.readCells = CT.Utils.curry((rs, re, cs, ce, data) => {
    [cs, ce] = CT.GridUtils.checkRange(cs, ce)
    const selector = `td:nth-child(n+${cs}):nth-child(-n+${ce})`

    const read = CT.Utils.compose(
        CT.Utils.map((row) => [...row]),
        CT.GridUtils.map(CT.GridUtils.read(selector)),
        CT.GridUtils.readRows(rs, re))

    const execute = CT.Utils.compose(
        CT.Utils.chain(read),
        Maybe.of)

    return execute(data)
})

