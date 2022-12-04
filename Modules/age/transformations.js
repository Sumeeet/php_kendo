const u = CT.Utils;
const g = CT.GridUtils;

const transformations = {
  ageGridAux: {
    init: { transform: [g.modelToGrid("ageGridParam", "ageGrid")] },
    apply: {
      transform: g.gridToModel("ageGridParam", "ageGrid", "age"),
      beforeTransform: [g.dropTrailingColumns(u.isDefined)],
    },
    bind: "ageGridParam_ageGrid",
  },
};
