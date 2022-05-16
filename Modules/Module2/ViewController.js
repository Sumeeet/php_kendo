'use strict'
const ViewController = function (viewModel) {
    const v = CT.Validations
    const u = CT.Utils;

    function bindDependencies (viewModel) {
        const data = CT.GridUtils.populate(viewModel.get('ageGrid.value'), ["fage", "sage"])
        viewModel.set('ageGrid.value', data)

        //const data = viewModel.get('ageGrid.value')
        const dataSource = {
            columns: gridInfo.columns,
            dataSource: data,
            width: gridInfo.width,
            height: gridInfo.height,
            editable: "incell" }
        $('#ageGridId').kendoGrid(dataSource)
    }

    (function() {
        viewModel.registerValidations('fage.value', [v.compare
            (
                "Fathers age should be greater than sons age",
                (sage, fage) => fage < sage, // criterion to compare
                viewModel.get('sage.value') // value to compare with
            ), v.isPositive('Age must be a positive number')],
            u.updateError("errorId1")
        );

        viewModel.registerValidations('sage.value',[v.compare
            (
                "Sons age should be less than fathers age",
                (fage, sage) => sage > fage, // criterion to compare
                viewModel.get('fage.value') // value to compare with
            ), v.isPositive('Age must be a positive number')],
            u.updateError("errorId2")
        );
        bindDependencies(viewModel)
    })();
}