<?php

require_once ("vendor\autoload.php");
require_once ("2020.1.114\wrappers\Autoload.php");

use CT\Samples\Sample1\MainView;
use CT\Samples\Sample1\View;

$view = new MainView(
    new View());

$view->render();