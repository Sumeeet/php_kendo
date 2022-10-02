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
            <input id = {$this->myBindAttributes['id']}
            style = "text-align:left; width: max-content; margin: 5px"
            class = "c-input c-numeric"
            data-step = 0
            data-bind = "value: {$this->myBindAttributes['bind']}"
            data-role = "numerictextbox"/>
        </div>
        HTML;
    }
}