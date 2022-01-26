<?php


namespace CT\Controls;

use CT\Interfaces\IView;

class FooterView implements IView
{
    private array $myBindAttributes;

    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
    }

    public function render()
    {
        echo <<<HTML
        <div id={$this->myBindAttributes['id']} class = "horizontalLayout">
            <button id="undo" data-bind = "enabled: {$this->myBindAttributes['undo']}" style = "margin: 5px; padding: 5px">Undo</button>
            <button id="redo" data-bind = "enabled: {$this->myBindAttributes['redo']}" style = "margin: 5px; padding: 5px">Redo</button>
            <button id="load" style = "margin: 5px; padding: 5px">Load</button>
            <button id="cache" style = "margin: 5px; padding: 5px">Clear Cache</button>
            <button id="apply" data-bind = "enabled: {$this->myBindAttributes['changed']}" style = "margin: 5px; padding: 5px">Apply</button>
        </div>
        HTML;
    }
}