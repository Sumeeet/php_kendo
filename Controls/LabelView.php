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
        <span id = {$this->myBindAttributes['labelId']}
        title = ""
        class = "c-label"
        style = "">{$this->myBindAttributes['name']}</span>
        HTML;
    }
}