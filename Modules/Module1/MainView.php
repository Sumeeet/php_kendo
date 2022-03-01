<?php

namespace CT\Modules\Module1;

use CT\Controls\FooterView;
use CT\Controls\ToolBarView;
use CT\Interfaces\IView;

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
            <link href="./Modules/Module1/main.css" rel="stylesheet"/>
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

        <script src="./JsLib/Decorators.js"></script>
        <script src="./JsLib/Utils.js"></script>
        <script src="./JsLib/Validations.js"></script>
        <script src="./JsLib/Either.js"></script>
        <script src="./JsLib/DataProxy.js"></script>
        <script src="./JsLib/ViewModel.js"></script>
        <script src="./JsLib/GridUtils.js"></script>
        <script src="./JsLib/History.js"></script>
        <script src="./JsLib/Command.js"></script>
        <script src="./JsLib/StringUtils.js"></script>
        <script src="./JsLib/Maybe.js"></script>

        <script src="./Modules/Module1/ModuleInstance.js"></script>
        <script src="./Modules/Module1/BmiMapper.js"></script>
        <script src="./Modules/Module1/BmiController.js"></script>
        <script src="./Modules/Module1/ToolBarController.js"></script>
        <script src="./Modules/Module1/StringTests.js"></script>
    </html>
<?php
    }
}

