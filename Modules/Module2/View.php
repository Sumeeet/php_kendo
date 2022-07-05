<?php

namespace CT\Modules\Module2;

use CT\Controls\GridView;
use CT\Controls\LabelledNumericTextView;
use CT\Controls\ToolBarView;
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

        $grid = new GridView(['attribute' => 'ageGrid.value',
            'gridId' => 'ageGridId']);

        $gridToolbar = new ToolBarView('toolBarViewId',
            [
                'addRow' => ['id' => 'addRowId', 'name' => '+ Row', 'action' => 'ageGrid.addRow'],
                'removeRow' => ['id' => 'removeRowId', 'name' => '- Row', 'action' => 'ageGrid.removeRow'],
                'addColumn' => ['id' => 'addColumnId', 'name' => '+ Column', 'action' => 'age.addColumn'],
                'removeColumn' => ['id' => 'removeColumnId', 'name' => '- Column', 'action' => 'age.removeColumn']
            ]);
?>
<div>
    <div class = 'horizontal_layout'>
        <?php
        $fageView->render();
        $sageView->render();
        ?>
    </div>
    <div>
        <?php $gridToolbar->render(); ?>
    </div>
    <?php $grid->render(); ?>
</div>

<?php
    }
}
