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
            <div data-role = "grid" id = {$this->myBindAttributes['gridId']}
                class = "c-input c-grid" title="Grid"
                data-editable = "true"
                data-columns = {$this->myBindAttributes["columnInfo"]}
                data-bind='source: {$this->myBindAttributes["attribute"]}'
                style="height: 200px; width: 400px;">
            </div>
        HTML;
    }
}