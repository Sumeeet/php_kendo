<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class GroupView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $this->myAttributes = $attributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'div');
    }
}