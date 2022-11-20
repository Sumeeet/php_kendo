"use strict";
const ViewController = function (viewModel) {
  const v = CT.Validations;
  const u = CT.Utils;
  const g = CT.GridUtils;
  const a = CT.ArrayUtils;

  const undoRedo = new UndoRedo(UNDO_REDO_ITEMS.commands);

  function registerValidations(vm) {
    vm.registerValidations("fage", [
      v.fetchAndCompare(
        "Fathers age should be greater than sons age",
        (sage, fage) => fage < sage, // criterion to compare
        () => vm.get("sage") // value to compare with
      ),
      v.isPositive("Fathers age must be a positive number"),
    ]);

    // TODO: validations compares with old value rather than changed
    vm.registerValidations("sage", [
      v.fetchAndCompare(
        "Sons age should be less than fathers age",
        (fage, sage) => sage > fage, // criterion to compare
        () => vm.get("fage") // value to compare with
      ),
      v.isPositive("Sons age must be a positive number"),
    ]);

    const validateCells = (data) => {
      const validate = u.compose(
        g.map(
          u.chainAndCompose([
            v.isInRange(
              u.getSafeData("min", data).join(),
              u.getSafeData("max", data).join()
            ),
            u.chain(v.isPositive("Age must be a positive number")),
          ])
        ),
        u.getSafeDataArray(/^\w+\d+$/g) // return values for all the matching properties
      );

      return validate(data);
    };

    // map each element of a grid column and check for number validation
    vm.registerValidations("AuxObject0", [
      g.map(validateCells),
      a.hasDuplicates("Duplicate values", "parameter"),
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
