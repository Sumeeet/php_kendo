<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class NumericTextView extends BaseView implements IView
{
    public function __construct(array $attributes)
    {
        $attributes += ['class' => "c-input c-numeric"];
        $attributes += ['data-role' => 'numerictextbox'];
        $attributes += ['data-step' => 0];
        $attributes += ['data-bind' => "value: {$attributes['bind']}"];

        // these keys are not directly used as attributes, remove them
        unset($attributes['bind']);
        $this->myAttributes = $attributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'input');
    }
}