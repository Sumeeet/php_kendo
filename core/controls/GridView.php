<?php


namespace CT\Core\Controls;

use CT\Core\Interface\IView;

define("BOOLEAN_TEMPLATE", '<input type="checkbox" #= checked ? \'checked = "checked"\' : "" #/>');

class GridView extends BaseView implements IView
{
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
                $template = $this->getTemplate($key, $value, $column['field']);
                    $colAttributes[$key] = (string)$value;
                if ($template !== null) {
                    $colAttributes['template'] = $template;
                }
            }
            $attributes[] = $colAttributes;
        }
        return json_encode($attributes);
    }

    private function getTemplate($key, $value, $field): ?string {
        if ($key !== 'type') return null;

        $fieldName = (string)$field;
        return match ((string)$value) {
            'boolean' => "#= CT.Templates.getBooleanTemplate($fieldName)#",
            default => null
        };
    }
}