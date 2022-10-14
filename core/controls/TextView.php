<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class TextView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $this->myAttributes += ['class' => "c-input c-textbox k-textbox"];
        $this->myAttributes += ['data-role' => 'textbox'];
        $this->myAttributes += ['data-value-update' => 'keypress'];
        $this->myAttributes += ['data-bind' => "value: {$attributes['bind']}"];

        // these keys are not directly used as attributes, remove them, add remaining
        $this->merge($attributes, ['bind']);

    }

    public function render($root)
    {
        return $this->renderVirtualDOM($root, 'input');
    }
}