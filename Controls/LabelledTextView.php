<?php


namespace CT\Controls;

use CT\Interfaces\IView;
use CT\Controls\TextView;
use CT\Controls\LabelView;

class LabelledTextView implements IView
{
    private array $myBindAttributes;
    private IView $myLabelView;
    private IView $myTextView;

    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
        $this->myTextView = new TextView($bindAttributes);
        $this->myLabelView = new LabelView($bindAttributes);
    }

    public function render()
    {
        echo <<<HTML
<div style = "{$this->myBindAttributes['style']}">
HTML;

        echo <<<HTML
{$this->myLabelView->render()}
{$this->myTextView->render()}
HTML;

        echo <<<HTML
</div>
HTML;
    }
}