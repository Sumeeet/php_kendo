<?php

namespace CT\WebCore;

use CT\Controls\GridView;
use CT\Controls\GroupView;
use CT\Controls\NumericTextView;
use CT\Controls\TextView;
use CT\Controls\ButtonView;
use CT\Controls\LabelView;
use JetBrains\PhpStorm\Pure;

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
            'group' => new GroupView($attributes),
            default => null,
        };
    }
}