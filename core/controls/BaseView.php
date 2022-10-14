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

    /**
     * @param array $array
     * @param array $filters
     *
     * @return void
     */
    protected function merge(array $array, array $filters = []) {
        $filteredArray = array_filter(
            $array,
            fn($key) => !array_key_exists($key, $filters),
            ARRAY_FILTER_USE_KEY
        );

        $this->mergeAttribute($filteredArray);
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