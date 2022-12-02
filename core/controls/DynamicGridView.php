<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;
use DOMDocument;

class DynamicGridView extends BaseView implements IView
{
    use GridColumns;

    private int $columnCount = 12;

    public function __construct(array $attributes, $node)
    {
        $this->myAttributes += ['class' => "k-grid k-widget k-grid-display-block"];
        $this->myAttributes += ['data-role' => 'grid'];
        $this->myAttributes += ['data-navigatable' => true];
        $this->myAttributes += ['data-filterable' => false];
        $this->myAttributes += ['data-sortable' => false];
        $this->myAttributes += ['data-selectable' => "multiple cell"];
        $this->myAttributes += ['data-bind' => "source: {$attributes['bind']}"];
        $this->myAttributes += ['data-editable' => "{$attributes['editable']}"];
        $this->myAttributes += ['style' => "height: {$attributes['height']}; width: {$attributes['width']}"];
        $this->myAttributes += ['data-columns' => json_encode($this->makeDynAttributes($node->columns, $this->columnCount))];
        // these keys are not directly used as attributes, remove them, add remaining
        $this->merge($attributes, ['bind', 'width', 'height', 'editable']);
    }

    /**
     * @throws \DOMException
     */
    public function render($root): bool|\DOMElement
    {
        $gridView = $this->renderVirtualDOM($root, 'div');
        if (isset($this->myAttributes['actions'])) {
            $toolbar = new ToolBarView([
                'id' => 'toolBarId',
                'style' => '',
                'actions' => $this->myAttributes['actions']
            ]);
            $gridView->appendChild($toolbar->render($root));
        }
        return $gridView;
    }
}
