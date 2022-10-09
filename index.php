<?php

require_once ("vendor\autoload.php");
require_once ("2020.1.114\wrappers\Autoload.php");

use CT\Modules\ModuleView;

$view = new ModuleView("./Modules/Age/Controls.xml");
try {
    $view->render(null);
} catch (DOMException $e) {
}