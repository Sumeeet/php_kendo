<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class LabelView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $this->myAttributes += ['class' => "c-label"];
        $this->merge($attributes);
    }

    /**
     * @throws \DOMException
     */
    public function render($root): bool|\DOMElement
    {
        return $this->renderVirtualDOM($root, 'span', $this->myAttributes['name']);
    }
}