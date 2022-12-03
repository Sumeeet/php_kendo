const u = CT.Utils;
const g = CT.GridUtils;

const transformations = {
  ageGridAux: {
    init: [g.modelToGrid("ageGridParam", "ageGrid")],
    apply: [
      g.gridToModel("ageGridParam", "ageGrid", "age"),
      g.dropTrailingColumns(u.isDefined),
    ],
    bind: "ageGridParam_ageGrid",
  },
};
