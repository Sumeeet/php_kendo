<?php


namespace CT\Controls;

use CT\Interfaces\IView;

class LabelledNumericTextView implements IView
{
    private array $myBindAttributes;
    private IView $myLabelView;
    private IView $myNumericTextView;

    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
        $this->myNumericTextView = new NumericTextView($bindAttributes);
        $this->myLabelView = new LabelView($bindAttributes);
    }

    public function render()
    {
        echo <<<HTML
<div style = "{$this->myBindAttributes['style']}">
HTML;

        echo <<<HTML
{$this->myLabelView->render()}
{$this->myNumericTextView->render()}
<span id = {$this->myBindAttributes['errorId']} style = "color: orangered; font-style: italic"></span>
HTML;

        echo <<<HTML
</div>
HTML;
    }
}