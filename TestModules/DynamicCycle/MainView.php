<?php

namespace CT\TestModules\DynamicCycle;

use CT\Interfaces\IView;

class MainView implements IView
{
    private IView $myAdjView;
    private IView $myMeasView;
    private IView $myMonView;
    private IView $myStorageView;

    public function __construct(
        IView $adjView,
        IView $measView,
        IView $monView,
        IView $storageView) {
        $this->myAdjView = $adjView;
        $this->myMeasView = $measView;
        $this->myMonView = $monView;
        $this->myStorageView = $storageView;
    }

    public function render() {
        echo <<< HTML
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <title>Page Title</title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <link href="https://kendo.cdn.telerik.com/2021.2.616/styles/kendo.common.min.css" rel="stylesheet" />
        <link href="https://kendo.cdn.telerik.com/2021.2.616/styles/kendo.default.min.css" rel="stylesheet" />
        <script src="https://kendo.cdn.telerik.com/2021.2.616/js/jquery.min.js"></script>
        <script src="https://kendo.cdn.telerik.com/2021.2.616/js/kendo.all.min.js"></script>
    </head>

    <body id="dynamicCycleViewId">
        {$this->myAdjView->render()}
    </body>
    <script src="./TestModules/DynamicCycle/Controller.js"></script>
    <script src="./JsLib/Decorators.js"></script>
    <script src="./JsLib/Utils.js"></script>
    <script src="./WebCore/DataProxy.js"></script>
    <script src="./WebCore/ValuePredicates.js"></script>
    <script src="./WebCore/ViewModel.js"></script>
 </html>

HTML;
    }
}

