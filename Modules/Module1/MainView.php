<?php

namespace CT\Modules\Module1;

use CT\Controls\FooterView;
use CT\Interfaces\IView;

class MainView implements IView
{
    private IView $bmiView;
    private IView $footerView;

    public function __construct(IView $view) {
        $this->bmiView = $view;
        $this->footerView = new FooterView(['id' => 'footer', 'changed' => 'changed']);
    }

    public function render() {
        echo <<< HTML
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
HTML;
        echo <<< HTML
<body id="mainViewId">
<div>
    <div id = 'tabstrip'>
        <ul>
            <li class="k-state-active">View1</li>
            <li>View2</li>
        </ul>
HTML;
        $this->bmiView->render();
        $this->bmiView->render();

        echo <<< HTML
    </div>
HTML;

        $this->footerView->render();

        echo <<< HTML
</div>
</body>
            <script src="./Modules/Module1/ModuleInstance.js"></script>
            <script src="./Modules/Module1/BmiMapper.js"></script>
            <script src="./Modules/Module1/Controller.js"></script>
            <script src="./JsLib/Decorators.js"></script>
            <script src="./JsLib/Utils.js"></script>
            <script src="./JsLib/Validations.js"></script>
            <script src="./JsLib/Either.js"></script>
            <script src="./JsLib/DataProxy.js"></script>
            <script src="./JsLib/ViewModel.js"></script>
            <script src="./JsLib/GridUtils.js"></script>
</html>
HTML;
    }
}

