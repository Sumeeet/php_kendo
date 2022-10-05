<?php


namespace CT\Controls;

use CT\Interfaces\IView;

class TextView extends BaseView implements IView
{
    public function __construct(array $bindAttributes) {
        $bindAttributes += ['class' => "c-input c-textbox k-textbox"];
        $bindAttributes += ['data-role' => 'textbox'];
        $bindAttributes += ['data-value-update' => 'keypress'];
        $bindAttributes += ['data-bind' => "value: {$bindAttributes['bind']}"];

        // these keys are not directly used as attributes, remove them
        unset($bindAttributes['bind']);
        $this->myBindAttributes = $bindAttributes;

    }

    public function render($root)
    {
        return $this->renderVirtualDOM($root, 'input');
    }
}