<?php

namespace CT\Controls;

use CT\Interfaces\IView;

class LabelView extends BaseView implements IView
{
    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
        $this->myBindAttributes += ['class' => "c-label"];
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'span', $this->myBindAttributes['name']);
    }
}