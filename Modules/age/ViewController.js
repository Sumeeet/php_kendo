"use strict";
const ViewController = function (viewModel) {
  const v = CT.Validations;
  const u = CT.Utils;
  const g = CT.GridUtils;
  const a = CT.ArrayUtils;

  const undoRedo = new UndoRedo(UNDO_REDO_ITEMS.commands);

  function registerValidations(vm) {
    vm.registerValidations("fage", "fageInputId", [
      v.fetchAndCompare(
        "Fathers age should be greater than sons age",
        (sage, fage) => fage < sage, // criterion to compare
        () => vm.get("sage") // value to compare with
      ),
      v.isPositive("Fathers age must be a positive number"),
    ]);

    // TODO: validations compares with old value rather than changed
    vm.registerValidations("sage", "sageInputId", [
      v.fetchAndCompare(
        "Sons age should be less than fathers age",
        (fage, sage) => sage > fage, // criterion to compare
        () => vm.get("fage") // value to compare with
      ),
      v.isPositive("Sons age must be a positive number"),
    ]);

    const inRange = (rowData) =>
      v.isInRange(
        u.getSafeData("min", rowData).join(),
        u.getSafeData("max", rowData).join(),
        "Value not in range."
      );

    const validateColumns = u.curry((rowData, ri, colData, ci) => {
      const validateCells = u.chainAndCompose([
        inRange(rowData),
        u.chain(v.isPositive("Age should be a positive number")),
      ]);

      const message = validateCells(colData);
      return new GridMessage(message.type, "", ri, ci, message.message);
    });

    const validateRows = (rowData, ri) => {
      return u.compose(
        u.map(validateColumns(rowData, ri)),
        u.getSafeDataA(/^\w+\d+$/g) // return values for all the matching properties
      )(rowData);
    };

    // map each element of a grid column and check for number validation
    vm.registerValidations("ageGridParam_ageGrid", "ageGridId", [
      u.map(validateRows),
      a.hasDuplicates("Duplicate values", "parameter"),
    ]);
  }

  function bindCommands(vm) {
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

    // vm.set("canremoveRow", g.hasData("ageGridId"));
    // vm.set("canaddRow", true);
    // vm.set("canundo", undoRedo.canUndo("ageGridId"));
    // vm.set("canredo", undoRedo.canRedo("ageGridId"));
    // vm.set("canhelp", true);

    const subscription = GridActionSubscription("ageGridId");
    subscription.addRow("addRowId").subscribe((index) => {
      u.compose(
        () => vm.set("canundo", undoRedo.canUndo("ageGridId")),
        () => vm.set("canremoveRow", g.hasData("ageGridId")),
        pushAddRemoveCommand
      )(index);
    });

    subscription.removeRow("removeRowId").subscribe((index) => {
      u.compose(
        () => vm.set("canundo", undoRedo.canUndo("ageGridId")),
        () => vm.set("canremoveRow", g.hasData("ageGridId")),
        pushAddRemoveCommand
      )(index);
    });

    subscription.undoRow("undoId").subscribe({
      next(key) {
        undoRedo.undo("ageGridId");
        vm.set("canredo", true);
      },
    });

    subscription.redoRow("redoId").subscribe({
      next(key) {
        undoRedo.redo("ageGridId");
        vm.set("canundo", true);
      },
    });
  }

  (function () {
    registerValidations(viewModel);

    bindCommands(viewModel);
  })();
};
