<?php

namespace CT\TestModules\DynamicCycle;

use CT\Interfaces\IView;

class StorageView implements IView
{
    public function render()
    {
        echo <<< HTML
        <div><label>Storage View</label></div>
        HTML;
    }
}
