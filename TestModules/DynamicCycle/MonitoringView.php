<?php

namespace CT\TestModules\DynamicCycle;

use CT\Interfaces\IView;

class MonitoringView implements IView
{
    public function render()
    {
        echo <<< HTML
        <div><label>Monitoring View</label></div>
        HTML;
    }
}
