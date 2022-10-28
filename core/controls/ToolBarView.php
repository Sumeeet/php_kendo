<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class ToolBarView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $this->myAttributes += ['toolbarView' => []];
        $this->myAttributes['toolbarView'] += ['class' => "k-toolbar k-grid-toolbar"];
        $this->myAttributes['toolbarView'] += ['role' => 'toolbar'];
        $this->myAttributes['toolbarView'] += ['id' => $attributes['id']];
        $this->myAttributes += $this->makeAttributes($attributes['actions']);

        //$this->merge($attributes, ['actions']);
    }

    public function render($root): bool|\DOMElement
    {
        $group = new GroupView($this->myAttributes['toolbarView']);
        $parent = $group->render($root);
        foreach ($this->myAttributes['buttonView'] as $attribute) {
            $button = new ButtonView($attribute);
            $parent->appendChild($button->render($root));
        }
        return $parent;
    }

    private function makeAttributes($actions): array {
        $operations = explode('|', $actions);
        $toolBarAttributes = ['buttonView' => []];
        foreach ($operations as $op) {
            // in format name:action|name:action ....
            $buttonInfo = explode(':', $op);
            $name = trim($buttonInfo[0]);
            $bind = trim($buttonInfo[1]);
            $toolBarAttributes['buttonView'][] = [
                'id' => $bind . 'Id',
                'name' => $name,
                'bind' => 'can'.$bind,
                'action' => $bind,
                'class' => 'ct-toolbar'
            ];
        }
        return $toolBarAttributes;
    }
}

