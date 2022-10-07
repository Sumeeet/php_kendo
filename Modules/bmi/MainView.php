<?php

namespace CT\Modules\Bmi;

use CT\Core\Controls\FooterView;
use CT\Core\Controls\ToolBarView;
use CT\Core\Interfaces\IView;

class MainView implements IView
{
    private IView $bmiView;
    private IView $tooBarView;
    private IView $footerView;

    public function __construct(IView $view) {
        $this->bmiView = $view;

        $this->tooBarView = new ToolBarView("toolBarViewId",
            [
                'undo' => ['id' => 'undoId', 'name' => 'undo', 'bind' => 'undo', 'action' => 'age.undo'],
                'redo' => ['id' => 'redoId', 'name' => 'redo', 'bind' => 'redo', 'action' => 'age.redo']
            ]);

//        $this->footerView = new ToolBarView("footerViewId",
//            [
//                'cache' => ['id' => 'cacheId', 'name' => 'Clear Cache', 'bind' => 'cache'],
//                'load' => ['id' => 'loadId', 'name' => 'Reload', 'bind' => 'load'],
//                'apply' => ['id' => 'applyId', 'name' => 'Apply', 'bind' => 'changed']
//            ]);
        $this->footerView = new FooterView(['id' => 'footerViewId', 'changed' => 'changed']);
    }

    public function render() {
        ?>

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset='utf-8'>
            <meta http-equiv='X-UA-Compatible' content='IE=edge'>
            <title>UI Framework</title>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <link href="https://kendo.cdn.telerik.com/2021.2.616/styles/kendo.common.min.css" rel="stylesheet" />
            <link href="https://kendo.cdn.telerik.com/2021.2.616/styles/kendo.default.min.css" rel="stylesheet" />
            <link href="./Modules/Bmi/main.css" rel="stylesheet"/>
            <script src="https://kendo.cdn.telerik.com/2021.2.616/js/jquery.min.js"></script>
            <script src="https://kendo.cdn.telerik.com/2021.2.616/js/kendo.all.min.js"></script>

        </head>
        <body id="mainViewId">
        <div>
            <?php $this->tooBarView->render(); ?>
            <?php $this->bmiView->render(); ?>
            <?php $this->footerView->render(); ?>
        </div>
        </body>

        <script src="./Core/JsLib/Decorators.js"></script>
        <script src="./Core/JsLib/Utils.js"></script>
        <script src="./Core/JsLib/Validations.js"></script>
        <script src="./Core/JsLib/Either.js"></script>
        <script src="./Core/JsLib/DataProxy.js"></script>
        <script src="./Core/JsLib/ViewModel.js"></script>
        <script src="./Core/JsLib/GridUtils.js"></script>
        <script src="./Core/JsLib/Constants.js"></script>
        <script src="./Core/JsLib/History.js"></script>
        <script src="./Core/JsLib/Command.js"></script>
        <script src="./Core/JsLib/StringUtils.js"></script>
        <script src="./Core/JsLib/Maybe.js"></script>
        <script src="./Core/JsLib/ArrayUtils.js"></script>

        <script src="./Modules/Bmi/ModuleInstance.js"></script>
        <script src="./Modules/Bmi/BmiMapper.js"></script>
        <script src="./Modules/Bmi/BmiController.js"></script>
        <script src="./Modules/Bmi/StringTests.js"></script>
    </html>
<?php
    }
}

