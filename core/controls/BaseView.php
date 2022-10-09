<?php

namespace CT\Core\Controls;

abstract class BaseView
{
    protected array $myAttributes = [];

    protected function renderVirtualDOM($root, $elementName, $elementValue = '')
    {
        $element = $root->createElement($elementName, $elementValue);
        foreach ($this->myAttributes as $key => $value) {
            $element->setAttribute($key, $value);
        }
        return $element;
    }

    protected function unsetAttributes(array $array, array $filterArray) {
        foreach ($filterArray as $element) {
            if (array_key_exists($element, $array)) {
                unset($array[$element]);
            }
        }
        $this->myAttributes += $array;
    }
}