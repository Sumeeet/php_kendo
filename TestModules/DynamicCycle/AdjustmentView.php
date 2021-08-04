<?php

namespace CT\TestModules\DynamicCycle;

use CT\Controls\GridView;
use CT\Controls\TextView;
use CT\Interfaces\IView;
use kendo\UI\NumericTextBox;

class AdjustmentView implements IView
{
    public function render()
    {
        $textView1 = new TextView(['attribute' => 'aMonitoring[1].sLimits',
            'inpId' => 'input_field_id_1']);
        $textView2 = new TextView(['attribute' => 'storageSelectionMeasure[1]',
            'inpId' => 'input_field_id_2']);
        $gridView = new GridView();

        echo <<<HTML
        <div style = "margin-bottom: 5px">
            {$textView1->render()}
            {$textView2->render()}
        </div>
        <div style = "display: inline-block" id="footerId">
            <button id="apply" data-bind = "enabled: changed">Apply</button>
            <button id="load">Load</button>
            <button id="cache">Clear Cache</button>
        </div>
        HTML;
    }
}
