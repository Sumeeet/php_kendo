<?php

namespace CT\Samples\Sample1;

use CT\Controls\LabelledNumericTextView;
use CT\Interfaces\IView;
use CT\Controls\FooterView;

class View1 implements IView
{
    public function render()
    {
        $num1 = new LabelledNumericTextView(['attribute' => 'number1',
            'inpId' => 'Num1Id', 'labelId' => 'Num1LabelId:',
            'name' => 'Number1:', 'style' => 'margin-bottom: 5px',
            'error' => 'errors[0]']);

        $num2 = new LabelledNumericTextView(['attribute' => 'number2',
            'inpId' => 'Num2Id', 'labelId' => 'Num2LabelId',
            'name' => 'Number2', 'style' => 'margin-bottom: 5px',
            'error' => 'errors[1]']);

        echo <<<HTML
        <div>{$num1->render()}</div>
        <div>{$num2->render()}</div>
        HTML;
    }
}
