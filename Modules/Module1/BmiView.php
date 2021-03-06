<?php

namespace CT\Modules\Module1;

use CT\Controls\LabelledNumericTextView;
use CT\Controls\LabelledTextView;
use CT\Interfaces\IView;
use CT\Controls\GridView;
use CT\WebCore\JsonParser;

class BmiView implements IView
{
    public function render()
    {
        $ageView = new LabelledNumericTextView(['attribute' => 'age.value',
            'inpId' => 'ageId', 'labelId' => 'ageLabelId:',
            'name' => 'Age', 'style' => 'margin: 5px',
            'errorId' => 'errorId1']);

        $heightView = new LabelledNumericTextView(['attribute' => 'height.value',
            'inpId' => 'heightId', 'labelId' => 'heightLabelId',
            'name' => 'Height (cm)', 'style' => 'margin: 5px',
            'errorId' => 'errorId2']);

        $weightView = new LabelledNumericTextView(['attribute' => 'weight.value',
            'inpId' => 'weightId', 'labelId' => 'weightLabelId',
            'name' => 'Weight (kgs)', 'style' => 'margin: 5px',
            'errorId' => 'errorId3']);

        $bmiView = new LabelledNumericTextView(['attribute' => 'bmi',
            'inpId' => 'bmiId', 'labelId' => 'bmiLabelId',
            'name' => 'BMI', 'style' => 'margin: 5px',
            'errorId' => 'errorId4']);

        $grid = new GridView(['attribute' => 'bmiGrid',
            'gridId' => 'bmiGridId']);
?>
<div>
    <div class = 'horizontal_layout'>
        <?php
        $ageView->render();
        $heightView->render();
        $weightView->render();
        $bmiView->render();
        ?>
    </div>
    <?php $grid->render(); ?>
</div>

<?php
    }
}
