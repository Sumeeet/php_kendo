<?php

namespace CT\Controls;

use CT\Interfaces\IView;

class GroupView implements IView
{
    private array $myBindAttributes;
    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
    }

    public function render()
    {
        echo <<<HTML
<div class = {$this->myBindAttributes['class']}>
</div>
HTML;
    }
}