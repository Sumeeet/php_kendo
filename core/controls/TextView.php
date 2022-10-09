<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class TextView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $attributes += ['class' => "c-input c-textbox k-textbox"];
        $attributes += ['data-role' => 'textbox'];
        $attributes += ['data-value-update' => 'keypress'];
        $attributes += ['data-bind' => "value: {$attributes['bind']}"];

        // these keys are not directly used as attributes, remove them, add remaining
        $this->unsetAttributes($attributes, ['bind']);

    }

    public function render($root)
    {
        return $this->renderVirtualDOM($root, 'input');
    }
}