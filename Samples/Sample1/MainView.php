<?php

namespace CT\Samples\Sample1;

use CT\Controls\FooterView;
use CT\Interfaces\IView;

class MainView implements IView
{
    private IView $myMainView;
    private IView $myFooterView;

    public function __construct(IView $view) {
        $this->myMainView = $view;
        $this->myFooterView = new FooterView(['id' => 'footer', 'changed' => 'changed']);
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
            <script src="https://kendo.cdn.telerik.com/2021.2.616/js/jquery.min.js"></script>
            <script src="https://kendo.cdn.telerik.com/2021.2.616/js/kendo.all.min.js"></script>
        </head>
    HTML;

        echo <<< HTML
        <body id="mainViewId">
        HTML;
        echo <<< HTML
            {$this->myMainView->render()}
            {$this->myFooterView->render()}
        HTML;
        echo <<< HTML
        </body>
        HTML;

        echo <<< HTML
            <script src="./Samples/Sample1/Controller.js"></script>

            <script src="./JsLib/Decorators.js"></script>
            <script src="./JsLib/Utils.js"></script>
            <script src="./JsLib/Validations.js"></script>
            <script src="./JsLib/Either.js"></script>

            <script src="./WebCore/DataProxy.js"></script>
            <script src="./WebCore/ViewModel.js"></script>
            <script src="./WebCore/RegisterValidate.js"></script>
        HTML;
        echo <<< HTML
    </html>
HTML;
    }
}

