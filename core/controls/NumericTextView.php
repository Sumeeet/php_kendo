<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class NumericTextView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $this->myAttributes += ['class' => "c-input c-numeric"];
        $this->myAttributes += ['data-role' => 'numerictextbox'];
        $this->myAttributes += ['data-step' => 0];
        $this->myAttributes += ['data-bind' => "value: {$attributes['bind']}"];

        // these keys are not directly used as attributes, remove them, add remaining
        $this->merge($attributes, ['bind']);
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'input');
    }
}