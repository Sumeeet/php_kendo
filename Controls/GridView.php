<?php


namespace CT\Controls;

use CT\Core\Interface\IView;
use Kendo\UI\Grid;

class GridView extends BaseView implements IView
{
    public function __construct(array $bindAttributes) {
        $bindAttributes += ['class' => "k-grid k-widget k-grid-display-block"];
        $bindAttributes += ['data-role' => 'grid'];
        $bindAttributes += ['data-bind' => "source: {$bindAttributes['bind']}"];

        // these keys are not directly used as attributes, remove them
        unset($bindAttributes['bind']);
        $this->myBindAttributes = $bindAttributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'div');
    }
}