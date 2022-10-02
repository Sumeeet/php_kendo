<?php

namespace CT\Controls;

use CT\Interfaces\IView;

class LabelView implements IView
{
    private array $myBindAttributes;
    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
    }

    public function render() {
        echo <<<HTML
        <div class = "c-container c-numeric-container c-simple" style = "margin: 5px">
        <span id = {$this->myBindAttributes['id']}
        title = ""
        class = "c-label">{$this->myBindAttributes['name']}</span>
        </div>
        HTML;
    }
}