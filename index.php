<?php

require_once ("vendor\autoload.php");
require_once ("2020.1.114\wrappers\Autoload.php");

use CT\Modules\ModuleView;
use CT\Modules\Age\AgeView;

$view = new ModuleView(new AgeView());
$view->render(null);
