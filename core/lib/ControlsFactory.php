<?php

namespace CT\Core\Lib;

use CT\Core\Controls\DynamicGridView;
use CT\Core\Controls\GridView;
use CT\Core\Controls\GroupView;
use CT\Core\Controls\NumericTextView;
use CT\Core\Controls\TextView;
use CT\Core\Controls\ButtonView;
use CT\Core\Controls\LabelView;
use CT\Core\Controls\ToolBarView;

class ControlsFactory
{
    /**
     * Factory method for creating controls
     *
     * @param string $controlType type of control i.e. input, label, grid etc.
     * @param array  $attributes  custom html attributes
     * @param        $controlNode
     *
     * @return ButtonView|NumericTextView|GroupView|TextView|LabelView|GridView|DynamicGridView|ToolBarView|null
     */
    public static function create(string $controlType, array $attributes, $controlNode):
    ButtonView|NumericTextView|GroupView|TextView|LabelView|GridView|DynamicGridView|ToolBarView|null
    {
        /** @var TYPE_NAME $attributes */
        return match ($controlType) {
            'input' => new TextView($attributes),
            'numeric_input' => new NumericTextView($attributes),
            'grid' => new GridView($attributes, $controlNode),
            'dynamic_grid' => new DynamicGridView($attributes, $controlNode),
            'button' => new ButtonView($attributes),
            'label' => new LabelView($attributes),
            'group', 'block' => new GroupView($attributes),
            'toolbar' => new ToolBarView($attributes),
            default => null,
        };
    }
}
