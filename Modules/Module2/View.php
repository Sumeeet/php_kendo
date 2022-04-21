<?php

namespace CT\Modules\Module2;

use CT\Controls\LabelledNumericTextView;
use CT\Interfaces\IView;

class View implements IView
{
    public function render()
    {
        $fageView = new LabelledNumericTextView(['attribute' => 'fage.value',
            'inpId' => 'fageId', 'labelId' => 'fageLabelId:',
            'name' => 'Fathers Age', 'style' => 'margin: 5px',
            'errorId' => 'errorId1']);

        $sageView = new LabelledNumericTextView(['attribute' => 'sage.value',
            'inpId' => 'sageId', 'labelId' => 'sageLabelId',
            'name' => 'Sons Age', 'style' => 'margin: 5px',
            'errorId' => 'errorId2']);
?>
<div>
    <div class = 'horizontal_layout'>
        <?php
        $fageView->render();
        $sageView->render();
        ?>
    </div>
</div>

<?php
    }
}
