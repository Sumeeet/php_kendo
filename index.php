<?php

require_once ("vendor\autoload.php");
require_once ("2020.1.114\wrappers\Autoload.php");

//use CT\TestModules\DynamicCycle\AdjustmentView;
//use CT\TestModules\DynamicCycle\MainView;
//use CT\TestModules\DynamicCycle\MeasView;
//use CT\TestModules\DynamicCycle\MonitoringView;
//use CT\TestModules\DynamicCycle\StorageView;


use CT\TestModules\UreaBuffer\MainView;
use CT\TestModules\UreaBuffer\AdjustmentView;

//$dynamicCycleView = new MainView(
//    new AdjustmentView(),
//    new MeasView(),
//    new MonitoringView(),
//    new StorageView());
//
//$dynamicCycleView->render();

$ureaBufferView = new MainView(
    new AdjustmentView());

$ureaBufferView->render();