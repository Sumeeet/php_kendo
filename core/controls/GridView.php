<?php


namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class GridView extends BaseView implements IView
{
    public function __construct(array $attributes, $node) {
        $this->myAttributes += ['class' => "k-grid k-widget k-grid-display-block"];
        $this->myAttributes += ['data-role' => 'grid'];
        $this->myAttributes += ['data-bind' => "source: {$attributes['bind']}"];
        $this->myAttributes += ['data-editable' => "{$attributes['editable']}"];
        $this->myAttributes +=  ['style' => "height: {$attributes['height']}; width: {$attributes['width']}"];
        $this->myAttributes +=  ['data-columns' => $this->makeColumnAttributes($node->columns)];

        // these keys are not directly used as attributes, remove them, add remaining
        $this->merge($attributes, ['bind', 'width', 'height', 'editable']);
    }

    /**
     * @throws \DOMException
     */
    public function render($root): bool|\DOMElement
    {
        return $this->renderVirtualDOM($root, 'div');
    }

    private function makeColumnAttributes($columns): bool|string {
        $attributes = [];
        foreach ($columns->column as $column) {
            $colAttributes = [];
            foreach($column->attributes() as $key => $value) {
                $colAttributes[$key] = (string)$value;
                $template = $this->getTemplate($key, $value, $column['field']);
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