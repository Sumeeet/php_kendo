<?php

namespace CT\Core\Controls;

use DOMDocument;
use DOMElement;
use DOMException;

abstract class BaseView
{
    protected array $myAttributes = [];

    /**
     * Render HTML elements in memory.
     *
     * @param $root         DOMDocument instance
     * @param $elementName  string HTML element as name i.e. div, button, label etc.
     * @param $elementValue string Text to be shown in UI
     *
     * @return DOMElement|bool
     * @throws DOMException
     */
    protected function renderVirtualDOM(DOMDocument $root, string $elementName,
        string $elementValue = ''): DOMElement|bool
    {
        $element = $root->createElement($elementName, $elementValue);
        foreach ($this->myAttributes as $key => $value) {
            $element->setAttribute($key, $value);
        }
        return $element;
    }

    /**
     * Merge user defined attributes with component specific attributes
     * @param array $array custom attributes
     * @param array $filters filter attributes which are used to compose new
     *                       attributes
     *
     * @return void
     */
    protected function merge(array $array, array $filters = []) {
        foreach ($filters as $key) {
            if (isset($array[$key])) {
                unset($array[$key]);
            }
        }

        $this->mergeAttribute($array);
    }

    private function mergeAttribute(array $attributes) {
        foreach ($attributes as $key => $value) {
            if ($key === 'class' && array_key_exists($key, $this->myAttributes)) {
                // merge custom class styling
                $this->myAttributes[$key] = $this->myAttributes[$key].' '. $value;
            } else {
                $this->myAttributes[$key] = $value;
            }
        }
    }
}