<?php

namespace CT\Controls;

use CT\Interfaces\IView;

class NumericTextView extends BaseView implements IView
{
    public function __construct(array $bindAttributes)
    {
        $this->myBindAttributes = $bindAttributes;
        $this->myBindAttributes += ['class' => "c-input c-numeric"];
        $this->myBindAttributes += ['data-role' => 'numerictextbox'];
        $this->myBindAttributes += ['data-step' => 0];
        $this->myBindAttributes += ['data-bind' => "value: {$this->myBindAttributes['bind']}"];

        // these keys are not directly used as attributes, remove them
        array_diff($this->myBindAttributes, ['bind']);
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'input');
    }
}