<?php


namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class FooterView implements IView
{
    private array $myBindAttributes;

    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
    }

    public function render($root)
    {
        echo <<<HTML
        <div id={$this->myBindAttributes['id']} class = "horizontalLayout">
            <button id="loadId" style = "margin: 5px; padding: 5px">Load</button>
            <button id="cacheId" style = "margin: 5px; padding: 5px">Clear Cache</button>
            <button id="applyId" data-bind = "enabled: {$this->myBindAttributes['changed']}" style = "margin: 5px; padding: 5px">Apply</button>
        </div>
        HTML;
    }
}