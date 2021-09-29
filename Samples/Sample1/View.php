<?php

namespace CT\Samples\Sample1;

use CT\Controls\LabelledNumericTextView;
use CT\Controls\LabelledTextView;
use CT\Interfaces\IView;

class View implements IView
{
    public function render()
    {
        $numView1 = new LabelledNumericTextView(['attribute' => 'number1',
            'inpId' => 'Num1Id', 'labelId' => 'Num1LabelId:',
            'name' => 'Number1:', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId1']);

        $numView2 = new LabelledNumericTextView(['attribute' => 'number2',
            'inpId' => 'Num2Id', 'labelId' => 'Num2LabelId',
            'name' => 'Number2', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId2']);

        $strView = new LabelledTextView(['attribute' => 'string1',
            'inpId' => 'StrId', 'labelId' => 'StrLabelId',
            'name' => 'String', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId3']);

        echo <<<HTML
        <div>{$numView1->render()}</div>
        <div>{$numView2->render()}</div>
        <div>{$strView->render()}</div>
        HTML;
    }
}
