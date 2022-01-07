<?php

namespace CT\Modules\Module1;

use CT\Controls\LabelledNumericTextView;
use CT\Controls\LabelledTextView;
use CT\Interfaces\IView;
use CT\Controls\GridView;
use CT\WebCore\JsonParser;

class View implements IView
{
    public function render()
    {
        $ageView = new LabelledNumericTextView(['attribute' => 'age.value',
            'inpId' => 'ageId', 'labelId' => 'ageLabelId:',
            'name' => 'Age', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId1']);

        $heightView = new LabelledNumericTextView(['attribute' => 'height.value',
            'inpId' => 'heightId', 'labelId' => 'heightLabelId',
            'name' => 'Height', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId2']);

        $weightView = new LabelledNumericTextView(['attribute' => 'weight.value',
            'inpId' => 'weightId', 'labelId' => 'weightLabelId',
            'name' => 'Weight', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId3']);

        $bmiView = new LabelledNumericTextView(['attribute' => 'bmi',
            'inpId' => 'bmiId', 'labelId' => 'bmiLabelId',
            'name' => 'BMI', 'style' => 'margin-bottom: 10px',
            'errorId' => 'errorId4']);

        $grid = new GridView(['gridId' => 'bmiGridId']);

        echo <<<HTML
        {$ageView->render()}
        {$heightView->render()}
        {$weightView->render()}
        {$bmiView->render()}
        {$grid->render()}
        HTML;
    }
}