const u = CT.Utils;
const g = CT.GridUtils;

const transformations = {
  ageGridAux: {
    init: u.compose(
      g.dropTrailingColumns("ageGridParam_ageGrid"),
      g.modelToGrid("ageGridParam", "ageGrid")
    ),
    apply: u.compose(g.gridToModel("ageGridParam", "ageGrid")),
    bind: "ageGridParam_ageGrid",
    attribute: "age",
  },
};
