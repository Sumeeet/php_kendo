<?php

namespace CT\Controls;

use CT\Interfaces\IView;

class LabelView extends BaseView implements IView
{
    public function __construct(array $bindAttributes) {
        $bindAttributes += ['class' => "c-label"];
        $this->myBindAttributes = $bindAttributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'span', $this->myBindAttributes['name']);
    }
}