<?php

namespace CT\Core\Controls;

abstract class BaseView
{
    protected array $myAttributes;

    protected function renderVirtualDOM($root, $elementName, $elementValue = '')
    {
        $element = $root->createElement($elementName, $elementValue);
        foreach ($this->myAttributes as $key => $value) {
            $element->setAttribute($key, $value);
        }
        return $element;
    }
}