<?php


namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class ButtonView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $this->myAttributes += ['class' =>
            "k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base"];
        $this->myAttributes += ['button-role' => 'button'];
        $this->myAttributes += ['data-bind' => "enabled: {$attributes['bind']}"];
        // these keys are not directly used as attributes, remove them, add remaining
        $this->merge($attributes, ['bind', 'action']);
    }

    /**
     * @throws \DOMException
     */
    public function render($root): bool|\DOMElement
    {
        return $this->renderVirtualDOM($root, 'button', $this->myAttributes['name']);
    }
}
