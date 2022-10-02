<?php

require_once ("vendor\autoload.php");
require_once ("2020.1.114\wrappers\Autoload.php");

//use CT\Modules\Module1\MainView;
//use CT\Modules\Module1\BmiView;
use CT\Modules\Module2\MainView;
use CT\Modules\Module2\View;
//use CT\Modules\Module3\FormView;


//use Twig\Environment;
//use Twig\Loader\FilesystemLoader;

// Specify our Twig Templates location
//$loader = new FilesystemLoader('./Templates');

// Instantiate our Twig
//$twig = new Environment($loader);//, ['cache' => './Templates/Cache']);
//$template = $twig->load("index.twig");
//echo $template->render(['title' => 'BMI Calculator']);
//echo $template->renderBlock('content', ['header' => 'BMI Calculator']);

//$view = new MainView(new BmiView());
$view = new MainView(new View());
//$view = new FormView();
$view->render();