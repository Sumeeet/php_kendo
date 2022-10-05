<?php

namespace CT\Controls;

use CT\Interfaces\IView;

class GroupView extends BaseView implements IView
{
    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'div');
    }
}