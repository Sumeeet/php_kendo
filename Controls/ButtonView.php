<?php


namespace CT\Controls;

use CT\Interfaces\IView;
use DOMException;

class ButtonView extends BaseView implements IView
{
    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
        $this->myBindAttributes += ['class' =>
            "k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base"];
        $this->myBindAttributes += ['button-role' => 'button'];
        $this->myBindAttributes += ['data-bind' =>
            "enabled: {$this->myBindAttributes['bind']}, events: {click: {$this->myBindAttributes['action'] }}"];

        // these keys are not directly used as attributes, remove them
        array_diff($this->myBindAttributes, ['bind', 'action']);
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'button', $this->myBindAttributes['name']);
    }
}
