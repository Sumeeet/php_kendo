<?php


namespace CT\Controls;

use CT\Core\Interface\IView;
use DOMException;

class ButtonView extends BaseView implements IView
{
    public function __construct(array $bindAttributes) {
        $bindAttributes += ['class' =>
            "k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base"];
        $bindAttributes += ['button-role' => 'button'];
        $bindAttributes += ['data-bind' =>
            "enabled: {$bindAttributes['bind']}, events: {click: {$bindAttributes['action'] }}"];

        // these keys are not directly used as attributes, remove them
        unset($bindAttributes['bind']);
        unset($bindAttributes['action']);
        $this->myBindAttributes = $bindAttributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'button', $this->myBindAttributes['name']);
    }
}
