<?php

namespace CT\WebCore;

use CT\Core\Controls\GridView;
use CT\Core\Controls\GroupView;
use CT\Core\Controls\NumericTextView;
use CT\Core\Controls\TextView;
use CT\Core\Controls\ButtonView;
use CT\Core\Controls\LabelView;

class ControlsFactory
{
    /**
     * Factory method for creating controls
     *
     * @param string $controlType type of control i.e. input, label, grid etc.
     * @param array  $attributes  custom html attributes
     *
     * @return ButtonView|NumericTextView|GroupView|TextView|LabelView|GridView|null
     */
    public static function create(string $controlType, array $attributes):
    ButtonView|NumericTextView|GroupView|TextView|LabelView|GridView|null
    {
        return match ($controlType) {
            'input' => new TextView($attributes),
            'numeric_input' => new NumericTextView($attributes),
            'grid' => new GridView($attributes),
            'button' => new ButtonView($attributes),
            'label' => new LabelView($attributes),
            'group', 'block' => new GroupView($attributes),
            default => null,
        };
    }
}