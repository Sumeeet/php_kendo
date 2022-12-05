var CT = CT || {};
CT.GridUtils = CT.GridUtils || {};

CT.GridUtils.getColumnNames = (gridInfo) => {
  const colNames = CT.Utils.curry((key, colsInfo) =>
    colsInfo.map((colInfo) => colInfo["field"])
  );
  const getNames = CT.Utils.compose(
    CT.Utils.chain(colNames("field")),
    Maybe.of
  );

  return getNames(gridInfo);
};

CT.GridUtils.populate = (data, colsName = null) => {
  const u = CT.Utils;
  const createRow = u.curry((rowData) => {
    const row = {};
    rowData.forEach(
      (value, i) =>
        (row[colsName === null ? `col${i}` : colsName[i] ?? `col${i}`] = value)
    );
    return row;
  });

  const execute = u.compose(u.chain(u.map(createRow)), Maybe.of);

  return execute(data);
};

CT.GridUtils.getGrid = (gridId) => {
  gridId = gridId.indexOf("#") > -1 ? gridId : `#${gridId}`;
  return $(gridId).data("kendoGrid");
};

CT.GridUtils.hasData = (gridId) => {
  const execute = CT.Utils.compose(
    CT.Utils.chain((grid) => grid.dataSource.data().length > 0),
    Maybe.of,
    CT.GridUtils.getGrid
  );
  return execute(gridId);
};

CT.GridUtils.getData = (gridId) => {
  const readItems = (grid) =>
    grid.dataSource.data().length > 0 ? grid.items() : null;
  const read = CT.Utils.compose(
    CT.Utils.chain(readItems),
    Maybe.of,
    CT.GridUtils.getGrid
  );
  return read(gridId);
};

CT.GridUtils.getSourceData = (gridId) => {
  const read = CT.Utils.compose(
    CT.Utils.chain((grid) => grid.dataSource.data()),
    Maybe.of,
    CT.GridUtils.getGrid
  );
  return read(gridId);
};

CT.GridUtils.getSource = (gridId) => {
  const read = CT.Utils.compose(
    CT.Utils.chain((grid) => grid.dataSource),
    Maybe.of,
    CT.GridUtils.getGrid
  );
  return read(gridId);
};

CT.GridUtils.getSelectedRow = (gridId) => {
  const select = (grid) => grid.select();
  const selectedRow = CT.Utils.compose(
    CT.Utils.chain(select),
    Maybe.of,
    CT.GridUtils.getGrid
  );
  return selectedRow(gridId);
};

CT.GridUtils.getSelectedRowIndex = (gridId) => {
  const selectedRowIndex = CT.Utils.compose(
    (row) => row.index(),
    CT.GridUtils.getSelectedRow
  );
  return selectedRowIndex(gridId);
};

CT.GridUtils.isRowSelected = CT.Utils.curry(
  (gridId) => CT.GridUtils.getSelectedRowIndex(gridId) > -1
);

CT.GridUtils.selectRow = CT.Utils.curry((gridId, index) => {
  const execute = CT.Utils.compose(
    CT.Utils.chain((grid) => {
      grid.select(`tr:eq(${index})`);
      return index;
    }),
    Maybe.of,
    CT.GridUtils.getGrid
  );
  return execute(gridId);
});

CT.GridUtils.checkRange = (start, end) => {
  if (start > end) return [end, start];
  return [start, end];
};

CT.GridUtils.getRowSelector = (start, end) =>
  `tr:nth-child(n+${start}):nth-child(-n+${end})`;

CT.GridUtils.getColumnSelector = (start, end) =>
  `td:nth-child(n+${start}):nth-child(-n+${end})`;

CT.GridUtils.filter = CT.Utils.curry((selector, data) =>
  $(data).filter(selector)
);

CT.GridUtils.map = CT.Utils.curry((func, data) =>
  $.map(data, (item) => func(item))
);

CT.GridUtils.each = CT.Utils.curry((func, data) => $.each(data, func));

CT.GridUtils.readRows = CT.Utils.curry((rs, re, data) => {
  // -1 indicates all rows
  const [s, e] = CT.GridUtils.checkRange(rs, re <= -1 ? data.length : re);
  const selector = CT.GridUtils.getRowSelector(s, e);
  const execute = CT.Utils.compose(
    CT.Utils.chain(CT.GridUtils.filter(selector)),
    Maybe.of
  );
  return execute(data);
});

CT.GridUtils.readGridColumn = CT.Utils.curry((rs, re, cs, ce, gridId) => {
  [cs, ce] = CT.GridUtils.checkRange(cs, ce);
  const selector = CT.GridUtils.getColumnSelector(cs, ce);

  const rowsToCols = (rows) => {
    const cols = [];
    $.each(rows[0], () => cols.push([]));
    rows.forEach((row) => $(row).each((i, c) => cols[i].push(c)));
    return cols;
  };

  const read = CT.Utils.compose(
    rowsToCols,
    CT.GridUtils.map(
      CT.Utils.compose(CT.GridUtils.filter(selector), (item) => item.cells)
    ),
    CT.GridUtils.readRows(rs, re)
  );

  const execute = CT.Utils.compose(
    CT.Utils.chain(read),
    Maybe.of,
    CT.GridUtils.getData
  );

  return execute(gridId);
});

CT.GridUtils.readGridRow = CT.Utils.curry((rs, re, cs, ce, gridId) => {
  [cs, ce] = CT.GridUtils.checkRange(cs, ce);
  const selector = CT.GridUtils.getColumnSelector(cs, ce);

  const read = CT.Utils.compose(
    CT.Utils.map((row) => [...row]),
    CT.GridUtils.map(
      CT.Utils.compose(CT.GridUtils.filter(selector), (item) => item.cells)
    ),
    CT.GridUtils.readRows(rs, re)
  );

  const execute = CT.Utils.compose(
    CT.Utils.chain(read),
    Maybe.of,
    CT.GridUtils.getData
  );

  return execute(gridId);
});

CT.GridUtils.getRowInsertionIndex = CT.Utils.curry((ds, pos, si) => {
  const rowCount = ds.total();
  if (si === -1 || si > rowCount) return rowCount;

  if (pos === CELL_INSERTION_POSITION.start) return 0;
  if (pos === CELL_INSERTION_POSITION.end) return rowCount;
  if (pos === CELL_INSERTION_POSITION.before) return si;
  if (pos === CELL_INSERTION_POSITION.after) return Math.max(si, si + 1);
});

CT.GridUtils.insertRow = CT.Utils.curry((dataSource, index) => {
  // TODO: ability to add data specific blank rows or with some default values
  dataSource.insert(index, { checked: false, fage: 10, sage: 10 });
  return index;
});

CT.GridUtils.addRow = CT.Utils.curry((position, gridId) => {
  const dataSource = CT.GridUtils.getSource(gridId);
  const execute = CT.Utils.compose(
    CT.GridUtils.selectRow(gridId),
    CT.GridUtils.insertRow(dataSource),
    CT.GridUtils.getRowInsertionIndex(dataSource, position),
    CT.GridUtils.getSelectedRowIndex
  );
  return execute(gridId);
});

CT.GridUtils.addRowAt = CT.Utils.curry((index, gridId) => {
  const dataSource = CT.GridUtils.getSource(gridId);
  const execute = CT.Utils.compose(
    CT.GridUtils.selectRow(gridId),
    CT.GridUtils.insertRow(dataSource)
  );

  return execute(index);
});

CT.GridUtils.removeRow = CT.Utils.curry((gridId) => {
  const remove = CT.Utils.curry(function (grid, rowCount, index) {
    // remove from the end if nothing is selected
    index = index === -1 ? rowCount - 1 : index;
    grid.removeRow(`tbody tr:eq("${index}")`);
    return index;
  });

  const grid = CT.GridUtils.getGrid(gridId);
  const rowCount = grid.dataSource.total();
  const execute = CT.Utils.compose(
    CT.GridUtils.selectRow(gridId),
    (index) => (rowCount === index ? index - 1 : index),
    remove(grid, rowCount),
    CT.GridUtils.getSelectedRowIndex
  );

  let selIndex = execute(gridId);
  // we need removed index, restore index
  return rowCount === selIndex ? selIndex + 1 : selIndex;
});

CT.GridUtils.removeRowAt = CT.Utils.curry((index, gridId) => {
  const remove = CT.Utils.curry(function (idx, grid) {
    if (idx >= 0) {
      grid.removeRow(`tbody tr:eq("${idx}")`);
    }
    return idx;
  });

  const grid = CT.GridUtils.getGrid(gridId);
  const execute = CT.Utils.compose(
    CT.GridUtils.selectRow(gridId),
    (index) => index - 1,
    CT.Utils.chain(remove(index)),
    Maybe.of,
    CT.GridUtils.getGrid
  );

  // we are selecting next logical row, returned index from selectRow is
  // different from row removed, restore it
  let selIndex = execute(gridId);
  // we need removed index, restore index
  return selIndex + 1;
});

CT.GridUtils.modelToGrid = CT.Utils.curry((prop1, prop2, model) => {
  const array1 = model[prop1];
  const array2 = model[prop2];
  // keep map of key value pair, where key is parameter and value is grid model object/row
  const paramToGridModelMap = new Map();

  // fill everything except attribute value.
  const filter = (srcObj, dstObj) => {
    const keys = Object.keys(srcObj);
    let keyValue = null;
    keys.forEach((k) => {
      if (!Object.hasOwn(dstObj, k)) {
        keyValue = { key: k, value: srcObj[k] };
      }
    });
    return keyValue;
  };

  // fill primary array1. Primary array1 is superset of array2, all the required
  // properties shall be copied over in this step except the attribute value,
  // which array2 has and shall be converted to col0:value form.
  // add new grid object/row, copy constant properties only
  array1.forEach((e) => {
    if (!Object.hasOwn(e, "parameter")) return;
    const key = e.parameter;
    if (!paramToGridModelMap.has(key)) {
      // merge array1 object with target object. Initialize target object
      // with colCount, used to index columns later
      paramToGridModelMap.set(key, Object.assign({ colCount: 0 }, e));
    }
  });

  // fill array2, since all the information is already copied, just copy over
  // attribute values, in the form col1:value and so on.
  array2.forEach((e) => {
    const key = e.parameter;
    if (paramToGridModelMap.has(key)) {
      const obj = paramToGridModelMap.get(key);
      const keyValue = filter(e, obj);
      if (!CT.Utils.isUndefined(keyValue)) {
        // starts with 0 for each object
        const colIndex = obj.colCount;
        obj[`col${colIndex}`] = keyValue.value;
        //keyValue.value === BLANK_NUMERIC_VALUE ? "" : keyValue.value;
        obj.colCount = colIndex + 1;
      }
    }
  });

  // TODO: remove mutation ?
  const auxProp = `${prop1}_${prop2}`;
  model[auxProp] = Array.from(paramToGridModelMap.values());
  return model;
});

CT.GridUtils.gridToModel = CT.Utils.curry(
  (prop1, prop2, attribute, model, auxModel) => {
    const array1 = model[prop1];
    const array2 = model[prop2];

    const newArray1 = [];
    const newArray2 = [];

    if (CT.Utils.isUndefined(auxModel)) return [newArray1, newArray2];

    const notAnArray = (arr) =>
      CT.Utils.isUndefined(arr) || !Array.isArray(arr);
    if (notAnArray(array1)) return [newArray1, newArray2];
    if (notAnArray(array2)) return [newArray1, newArray2];

    const metaObj1 = Object.assign({}, array1.length > 0 ? array1[0] : {});
    const metaObj2 = Object.assign({}, array2.length > 0 ? array2[0] : {});

    const getColValues = (row) => {
      const colsValue = [];
      for (let i = 0; i < row.colCount; i++) {
        if (Object.hasOwn(row, `col${i}`)) {
          const value = row[`col${i}`];
          colsValue.push(value);
        }
      }
      return colsValue;
    };

    const merge = (pObj, row) => {
      // only assign values which has properties in pObj
      const keys = Object.keys(row);
      keys.forEach((key) => {
        if (Object.hasOwn(pObj, key)) pObj[key] = row[key];
      });
    };

    let vectorIndex = 0;
    auxModel.forEach((row) => {
      // fill primary model array1 with defaults
      const pObj1 = Object.assign({}, metaObj1);
      merge(pObj1, row);
      newArray1.push(pObj1);

      // fill secondary model array2
      const pObj2 = Object.assign({}, metaObj2);
      merge(pObj2, row);

      const colsValue = getColValues(row);
      colsValue.forEach((colValue) => {
        const obj = { ...pObj2 };
        obj[attribute] = colValue;
        obj.vectorIndex = vectorIndex;
        newArray2.push(obj);
        vectorIndex = vectorIndex + 1;
      });
    });

    // TODO: remove mutation
    model[prop1] = newArray1;
    model[prop2] = newArray2;
    return model;
  }
);

CT.GridUtils.validateCells = CT.Utils.curry(
  (cellPropLike, validate, allowEmpty, data) => {
    const validateColumns = CT.Utils.curry((rowData, ri, colData, ci) => {
      const isEmpty = CT.Utils.curry(
        (data) => allowEmpty && CT.Utils.isUndefined(data)
      );

      const toGridMessage = CT.Utils.curry(
        (msg) => new GridMessage(msg.type, "", ri, ci, msg.message)
      );

      return CT.Utils.ifElse(
        isEmpty,
        (value) =>
          toGridMessage(
            new Message(MESSAGE_TYPE.info, "", `allow null values ${value}`)
          ),
        CT.Utils.compose(toGridMessage, validate(rowData))
      )(colData);
    });

    const validateRows = (rowData, ri) => {
      return CT.Utils.compose(
        CT.Utils.map(validateColumns(rowData, ri)),
        CT.Utils.getSafeDataA(cellPropLike) // return values for all the matching properties
      )(rowData);
    };

    return CT.Utils.map(validateRows, data);
  }
);

CT.GridUtils.dropTrailingColumns = CT.Utils.curry((pred, data) => {
  const max = (arr) => Math.max(...arr);
  const findMaxIndex = CT.Utils.compose(
    max,
    CT.Utils.map(max),
    CT.Utils.getSafeIndexA(pred)
  );

  const idx = findMaxIndex(data) + 1;
  const idxDiv = Math.floor(idx / 10);
  const idxMod = idx % 10;
  const reg10 = new RegExp(`^col([${idx}-9]|[1-9][0-9]|100)$`, "g");
  const reg100 = new RegExp(`^col([${idxDiv}-9][${idxMod}-9]|100)$`, "g");
  CT.Utils.map(CT.Utils.safeDeleteA(idx < 10 ? reg10 : reg100))(data);
  return data;
});
