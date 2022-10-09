<?php

namespace CT\Modules\Age;

use CT\Core\Interface\IView;
use CT\Core\Lib\XMLRenderer;
use DOMException;

class AgeView implements IView
{
    /**
     * @throws DOMException
     */
    public function render($root)
    {
        ?>

        <div>
            <?php
            XMLRenderer::render("./Modules/Age/Controls.xml");
            ?>
        </div>

        <script src="./Modules/Age/ModuleInstance.js"></script>
        <script src="./Modules/Age/ViewController.js"></script>

        <?php
    }
}