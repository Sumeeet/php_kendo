<?php

namespace CT\TestModules\DynamicCycle;

use CT\Interfaces\IView;
use CT\Interfaces\IViewModel;

class MeasView implements IView
{
    var $myViewModel;
    public function __construct()
    {
    }

    public function render()
    {
        echo <<< HTML
        <div><label>Measurement View</label></div>
        HTML;
    }
}
