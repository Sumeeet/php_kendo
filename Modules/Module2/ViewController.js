'use strict'
const ViewController = function (viewModel) {
    const v = CT.Validations
    const u = CT.Utils;

    (function() {
        viewModel.registerValidations('fage.value', [v.comparision
            (
                "Fathers age should be greater than sons age",
                (sage, fage) => fage < sage,
                viewModel.get('sage.value')
            ), v.isPositive('Age must be a positive number')],
            u.updateError("errorId1")
        );

        viewModel.registerValidations('sage.value',[v.comparision
            (
                "Sons age should be less than fathers age",
                (fage, sage) => sage > fage,
                viewModel.get('fage.value')
            ), v.isPositive('Age must be a positive number')],
            u.updateError("errorId2")
        );
    })();
}