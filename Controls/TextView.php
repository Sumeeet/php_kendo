<?php


namespace CT\Controls;

use CT\Interfaces\IView;

class TextView implements IView
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
            class = "c-input c-textbox k-textbox"
            data-value-update="keypress"
            data-bind = "value: {$this->myBindAttributes['attribute']}"
            data-role = "textbox"/>
        </div>
        HTML;
    }
}