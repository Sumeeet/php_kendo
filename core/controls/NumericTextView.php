<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class NumericTextView extends BaseView implements IView
{
    public function __construct(array $bindAttributes)
    {
        $bindAttributes += ['class' => "c-input c-numeric"];
        $bindAttributes += ['data-role' => 'numerictextbox'];
        $bindAttributes += ['data-step' => 0];
        $bindAttributes += ['data-bind' => "value: {$bindAttributes['bind']}"];

        // these keys are not directly used as attributes, remove them
        unset($bindAttributes['bind']);
        $this->myBindAttributes = $bindAttributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'input');
    }
}