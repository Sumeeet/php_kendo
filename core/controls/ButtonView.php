<?php


namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class ButtonView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $attributes += ['class' =>
            "k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base"];
        $attributes += ['button-role' => 'button'];
        $attributes += ['data-bind' =>
            "enabled: {$attributes['bind']}, events: {click: {$attributes['action'] }}"];

        // these keys are not directly used as attributes, remove them
        unset($attributes['bind']);
        unset($attributes['action']);
        $this->myAttributes = $attributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'button', $this->myAttributes['name']);
    }
}
