<?php


namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class GridView extends BaseView implements IView
{
    private ToolBarView $toolBarView;
    public function __construct(array $attributes, $node) {
        $this->myAttributes += ['class' => "k-grid k-widget k-grid-display-block"];
        $this->myAttributes += ['data-role' => 'grid'];
        $this->myAttributes += ['data-bind' => "source: {$attributes['bind']}"];
        $this->myAttributes += ['data-editable' => "{$attributes['editable']}"];
        $this->myAttributes +=  ['style' => "height: {$attributes['height']}; width: {$attributes['width']}"];
        $this->myAttributes +=  ['data-columns' => $this->makeAttributes($node->columns)];

        // these keys are not directly used as attributes, remove them, add remaining
        $this->unsetAttributes($attributes, ['bind', 'width', 'height', 'editable']);
    }

    public function render($root) {
        return $this->renderVirtualDOM($root, 'div');
    }

    private function makeAttributes($columns): bool|string {
        $attributes = [];
        foreach ($columns->column as $column) {
            $colAttributes = [];
            foreach($column->attributes() as $key => $value) {
                $colAttributes[$key] = (string)$value;
            }
            $attributes[] = $colAttributes;
        }
        return json_encode($attributes);
    }
}