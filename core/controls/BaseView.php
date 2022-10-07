<?php

namespace CT\Core\Controls;

abstract class BaseView
{
    protected array $myBindAttributes;

    protected function renderVirtualDOM($root, $elementName, $elementValue = '')
    {
        $element = $root->createElement($elementName, $elementValue);
        foreach ($this->myBindAttributes as $key => $value) {
            $element->setAttribute($key, $value);
        }
        return $element;
    }
}