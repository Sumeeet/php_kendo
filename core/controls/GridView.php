<?php


namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class GridView extends BaseView implements IView
{
    private ToolBarView $toolBarView;
    public function __construct(array $attributes, $node) {
        $attributes += ['class' => "k-grid k-widget k-grid-display-block"];
        $attributes += ['data-role' => 'grid'];
        $attributes += ['data-bind' => "source: {$attributes['bind']}"];
        $attributes +=  ['data-columns' => $this->makeAttributes($node->columns)];

        // these keys are not directly used as attributes, remove them
        unset($attributes['bind']);
        $this->myAttributes = $attributes;
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'div');
    }

    private function makeAttributes($columns): bool|string
    {
        $attributes = [];
        foreach ($columns->column as $column) {
            $colAttributes = [];
            foreach($column->attributes() as $key => $value) {
                $colAttributes[$key] = $value;
            }
            $attributes += $colAttributes;
        }
        print_r(json_encode($attributes));
        return json_encode($attributes);
    }
}