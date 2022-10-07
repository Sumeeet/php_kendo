<?php

namespace CT\Modules\Age;

use CT\Core\Interface\IView;
use CT\Core\Lib\XMLRenderer;

class MainView implements IView
{
    public function __construct() {
    }

    /**
     * @throws \DOMException
     */
    public function render($root) {
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
            <link href="./Modules/Age/main.css" rel="stylesheet"/>
            <script src="https://kendo.cdn.telerik.com/2021.2.616/js/jquery.min.js"></script>
            <script src="https://kendo.cdn.telerik.com/2021.2.616/js/kendo.all.min.js"></script>

        </head>
        <body id="mainViewId">
        <div>
            <?php
            XMLRenderer::render("./Modules/Age/Controls.xml");
            ?>
        </div>
        </body>

        <script src="./core/jslib/Decorators.js"></script>
        <script src="./core/jslib/Utils.js"></script>
        <script src="./core/jslib/Validations.js"></script>
        <script src="./core/jslib/Either.js"></script>
        <script src="./core/jslib/DataProxy.js"></script>
        <script src="./core/jslib/ViewModel.js"></script>
        <script src="./core/jslib/GridUtils.js"></script>
        <script src="./core/jslib/Maybe.js"></script>
        <script src="./core/jslib/Constants.js"></script>
        <script src="./core/jslib/History.js"></script>
        <script src="./core/jslib/Command.js"></script>
        <script src="./core/jslib/ArrayUtils.js"></script>

        <script src="./Modules/Age/ModuleInstance.js"></script>
        <script src="./Modules/Age/ViewController.js"></script>
        <script src="./Modules/Age/GridInfo.js"></script>
    </html>
<?php
    }
}

