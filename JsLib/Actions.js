var CT = CT || {};
CT.Actions = CT.Actions || {};

CT.Actions.addRow = CT.Utils.curry((gridId, position) =>
    CT.GridUtils.addRow(position, gridId))

CT.Actions.removeRow = CT.Utils.curry((gridId, position) =>
    CT.GridUtils.removeRow(position, gridId))