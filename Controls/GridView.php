<?php


namespace CT\Controls;

use CT\Interfaces\IView;
use Kendo\UI\Grid;

class GridView extends BaseView implements IView
{
    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;

        $this->myBindAttributes += ['class' => "k-grid k-widget k-grid-display-block"];
        $this->myBindAttributes += ['data-role' => 'grid'];
        $this->myBindAttributes += ['data-bind' => "source: {$this->myBindAttributes['bind']}"];
        // these keys are not directly used as attributes, remove them
        array_diff($this->myBindAttributes, ['bind']);
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'div');
    }
}