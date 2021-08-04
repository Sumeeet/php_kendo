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
        <div id={$this->myBindAttributes['id']}>
            <button id="apply" data-bind = "enabled: {$this->myBindAttributes['changed']}">Apply</button>
        </div>
        HTML;
    }
}