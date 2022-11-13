"use strict";
const ViewController = function (viewModel) {
  const v = CT.Validations;
  const u = CT.Utils;
  const g = CT.GridUtils;
  const a = CT.ArrayUtils;

  const undoRedo = new UndoRedo(UNDO_REDO_ITEMS.commands);

  function registerValidations(viewModel) {
    viewModel.registerValidations("fage.value", [
      v.fetchAndCompare(
        "Fathers age should be greater than sons age",
        (sage, fage) => fage < sage, // criterion to compare
        () => viewModel.get("sage.value") // value to compare with
      ),
      v.isPositive("Fathers age must be a positive number"),
    ]);

    // TODO: validations compares with old value rather than changed
    viewModel.registerValidations("sage.value", [
      v.fetchAndCompare(
        "Sons age should be less than fathers age",
        (fage, sage) => sage > fage, // criterion to compare
        () => viewModel.get("fage.value") // value to compare with
      ),
      v.isPositive("Sons age must be a positive number"),
    ]);

    // map each element of a grid column and check for number validation
    viewModel.registerValidations("ageGrid.value", [
      g.map(
        u.chainAndCompose([
          v.isInRange(0, 100),
          v.isPositive("Fathers age must be a positive number"),
          u.getSafeData("fage"),
          v.compareProp(
            "Fathers age should be greater than sons age",
            (sage, fage) => sage > fage,
            "sage",
            "fage"
          ),
        ])
      ),
      a.hasDuplicates("Duplicate values", "fage"),
    ]);

    viewModel.registerValidations("ageGrid.value", [
      g.map(
        u.chainAndCompose([
          v.isPositive("Sons age must be a positive number"),
          u.getSafeData("sage"),
        ])
      ),
    ]);
  }

  function bindCommands(viewModel) {
    const pushAddRemoveCommand = (index) => {
      const add = g.addRowAt(index);
      const remove = g.removeRowAt(index);
      const undoCommand = new EditCommand(
        undoRedo,
        () => add("ageGridId"),
        function () {
          return this.canUndo;
        }
      );
      const redoCommand = new EditCommand(
        undoRedo,
        () => remove("ageGridId"),
        function () {
          return this.canRedo;
        }
      );
      undoRedo.push(
        "ageGridId",
        new AddRemoveCommand("ageGridId", undoCommand, redoCommand)
      );
    };

    const disableElement = CT.Utils.curry((gridId, element) => {
      g.hasData(gridId)
        ? element.removeAttribute("disabled")
        : element.setAttribute("disabled", "");
    });

    const subscription = GridActionSubscription("ageGridId");
    subscription.addRow("addRowId").subscribe((index) => {
      u.compose(
        () => disableElement("ageGridId", getElement("removeRowId")),
        pushAddRemoveCommand
      )(index);
    });

    subscription
      .removeRow("removeRowId")
      .subscribe((value) =>
        disableElement("ageGridId", getElement("removeRowId"))
      );

    subscription.undoRow("undoId").subscribe({
      next(key) {
        undoRedo.undo("ageGridId");
      },
    });

    subscription.redoRow("redoId").subscribe({
      next(key) {
        undoRedo.redo("ageGridId");
      },
    });
  }

  (function () {
    registerValidations(viewModel);

    bindCommands(viewModel);
  })();
};
