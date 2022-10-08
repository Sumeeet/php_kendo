<?php

namespace CT\Core\Lib;

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
     *
     * @return ButtonView|NumericTextView|GroupView|TextView|LabelView|GridView|ToolBarView|null
     */
    public static function create(string $controlType, array $attributes, $controlNode):
    ButtonView|NumericTextView|GroupView|TextView|LabelView|GridView|ToolBarView|null
    {
        return match ($controlType) {
            'input' => new TextView($attributes),
            'numeric_input' => new NumericTextView($attributes),
            'grid' => new GridView($attributes, $controlNode),
            'button' => new ButtonView($attributes),
            'label' => new LabelView($attributes),
            'group', 'block' => new GroupView($attributes),
            'toolbar' => new ToolBarView($attributes),
            default => null,
        };
    }
}