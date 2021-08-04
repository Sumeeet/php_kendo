<?php


namespace CT\Controls;

use CT\Interfaces\IView;

class NumericTextView implements IView
{
    private array $myBindAttributes;
    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
    }

    public function render()
    {
        echo <<< HTML
        <div>
            <input id = {$this->myBindAttributes['inpId']}
            style = "width: max-content"
            class = "c-input c-numeric"
            type = "number"
            data-step = 0
            data-bind = "value: {$this->myBindAttributes['attribute']}"
            data-role = "numerictextbox"/>
        </div>
        HTML;
    }
}