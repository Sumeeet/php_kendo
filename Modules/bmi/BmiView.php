<?php

namespace CT\Modules\Bmi;

use CT\Core\Interface\IView;
use CT\Core\Lib\XMLRenderer;
use DOMException;

class BmiView implements IView
{
    /**
     * @throws DOMException
     */
    public function render($root)
    {
        ?>

        <div>
            <?php
            XMLRenderer::render("./Modules/Bmi/Controls.xml");
            ?>
        </div>

        <script src="./Modules/Bmi/ModuleInstance.js"></script>
        <script src="./Modules/Bmi/BmiController.js"></script>
        <script src="./Modules/Bmi/BmiMapper.js"></script>

        <?php
    }
}