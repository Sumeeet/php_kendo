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
            <div data-role = "grid" id = 'gridId' class = "k-grid k-widget k-grid-display-block" title="Grid" style="font-size: small">
            </div>
        HTML;
    }
}