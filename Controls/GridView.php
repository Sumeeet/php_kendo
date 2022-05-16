<?php


namespace CT\Controls;

use CT\Interfaces\IView;
use Kendo\UI\Grid;

class GridView implements IView
{
    private array $myBindAttributes;
    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
    }

    public function render() {
        echo <<<HTML
            <div data-role = "grid"
            id = {$this->myBindAttributes['gridId']}
            class = "k-grid k-widget k-grid-display-block" 
            data-editable = "true"
            data-bind = "source: {$this->myBindAttributes['attribute']}"
            title = "Grid" style = "font-size: small; margin: 5px">
            </div>
HTML;
    }
}