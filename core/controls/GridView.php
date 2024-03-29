<?php


namespace CT\Core\Controls;

use CT\Core\Interface\IView;
use DOMDocument;

class GridView extends BaseView implements IView
{
    use GridColumns;
    public function __construct(array $attributes, $node)
    {
        $this->myAttributes += ['class' => "k-grid k-widget k-grid-display-block"];
        $this->myAttributes += ['data-role' => 'grid'];
        $this->myAttributes += ['data-navigatable' => true];
        $this->myAttributes += ['data-filterable' => true];
        $this->myAttributes += ['data-sortable' => true];
        $this->myAttributes += ['data-selectable' => "multiple row"];
        $this->myAttributes += ['data-bind' => "source: {$attributes['bind']}"];
        $this->myAttributes += ['data-editable' => "{$attributes['editable']}"];
        $this->myAttributes += ['style' => "height: {$attributes['height']}; width: {$attributes['width']}"];
        $this->myAttributes += ['data-columns' => json_encode($this->makeAttributes($node->columns))];
//        $this->myAttributes +=  ['data-selectable' => true];
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
