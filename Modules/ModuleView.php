<?php

namespace CT\Modules;

use CT\Core\Interface\IView;

class ModuleView
{
    private IView $myView;
    /**
     * @throws \DOMException
     */
    public function __construct(IView $view) {
        $this->myView = $view;
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
            <link href="./Modules/Main.css" rel="stylesheet"/>
            <script src="https://kendo.cdn.telerik.com/2021.2.616/js/jquery.min.js"></script>
            <script src="https://kendo.cdn.telerik.com/2021.2.616/js/kendo.all.min.js"></script>

        </head>
        <body id="mainViewId">

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
        <script src="./core/jslib/Observable.js"></script>
        <script src="./core/jslib/StringUtils.js"></script>
        <script src="./core/jslib/GridActionSubscription.js"></script>
        <script src="./core/jslib/Log.js"></script>
        <script src="./core/Templates/Templates.js"></script>


        <div>
            <?php
            $this->myView->render(null);
            ?>
        </div>
        </body>

        </html>
        <?php
    }
}
