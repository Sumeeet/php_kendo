<?php

namespace CT\TestModules\UreaBuffer;

use CT\Controls\LabelledNumericTextView;
use CT\Interfaces\IView;
use CT\Controls\FooterView;

class AdjustmentView implements IView
{
    public function render()
    {
        $delayTimeT1 = new LabelledNumericTextView(['attribute' => 'fDelayTimeT1',
            'inpId' => 'InpDelayTimeT1', 'labelId' => 'LabelDelayTimeT1',
            'name' => 'Delay Time T1[s]', 'style' => 'margin-bottom: 5px',
            'error' => 'errors[0]']);

        $delayTime2 = new LabelledNumericTextView(['attribute' => 'fDelayTimeT2',
            'inpId' => 'InpDelayTimeT2', 'labelId' => 'LabelDelayTimeT2',
            'name' => 'Delay Time T2[s]', 'style' => 'margin-bottom: 5px',
            'error' => 'errors[1]']);

        $footerView = new FooterView(['id' => 'footer', 'changed' => 'changed']);

        echo <<<HTML
        <div>{$delayTimeT1->render()}</div>
        <div>{$delayTime2->render()}</div>
        <div>{$footerView->render()}</div>
        HTML;
    }
}
