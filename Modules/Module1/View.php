<?php

namespace CT\Modules\Module1;

use CT\Controls\LabelledNumericTextView;
use CT\Controls\LabelledTextView;
use CT\Interfaces\IView;

class View implements IView
{
    public function render()
    {
        $ageView = new LabelledNumericTextView(['attribute' => 'age.value',
            'inpId' => 'ageId', 'labelId' => 'ageLabelId:',
            'name' => 'Age:', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId1']);

        $heightView = new LabelledNumericTextView(['attribute' => 'height.value',
            'inpId' => 'heightId', 'labelId' => 'heightLabelId',
            'name' => 'Height', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId2']);

        $weightView = new LabelledNumericTextView(['attribute' => 'weight.value',
            'inpId' => 'weightId', 'labelId' => 'weightLabelId',
            'name' => 'Weight', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId3']);

        $bmiView = new LabelledNumericTextView(['attribute' => 'bmi.value',
            'inpId' => 'bmiId', 'labelId' => 'bmiLabelId',
            'name' => 'BMI', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId4']);

        echo <<<HTML
        <div>{$ageView->render()}</div>
        <div>{$heightView->render()}</div>
        <div>{$weightView->render()}</div>
        <div>{$bmiView->render()}</div>
        HTML;
    }
}
