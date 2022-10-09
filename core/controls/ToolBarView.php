<?php

namespace CT\Core\Controls;

use CT\Core\Interface\IView;

class ToolBarView extends BaseView implements IView
{
    public function __construct(array $attributes) {
        $this->myAttributes += $this->makeAttributes($attributes['actions']);

        unset($attributes['actions']);
        $this->myAttributes += ['toolBarView' => $attributes];
    }

    public function render($root) {
        $group = new GroupView($this->myAttributes['toolBarView']);
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
                'style' =>  "height: 20px; width: 20px; margin: 5px"
            ];
        }
        return $toolBarAttributes;
    }
}

