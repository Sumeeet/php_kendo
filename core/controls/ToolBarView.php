<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class ToolBarView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $this->myAttributes = $this->makeAttributes($attributes);
    }

    public function render($root) {
        $group = new GroupView(['id' => 'toolBarId']);
        $parent = $group->render($root);
        foreach ($this->myAttributes as $attribute) {
            $button = new ButtonView($attribute);
            $parent->appendChild($button->render($root));
        }
        return $parent;
    }

    private function makeAttributes($attributes): array {
        $operations = explode('|', $attributes['actions']);
        $toolBarAttributes = [];
        foreach ($operations as $op) {
            $toolBarAttributes[] = [
                'id' => $op . 'Id',
                'name' => $op,
                'bind' => '',
                'action' => $op
            ];
        }
        return $toolBarAttributes;
    }
}

