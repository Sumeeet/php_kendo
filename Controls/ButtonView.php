<?php


namespace CT\Controls;

use CT\Interfaces\IView;

class ButtonView implements IView
{
    private array $myBindAttributes;
    private string $id;

    public function __construct(array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
    }

    public function render()
    {
?>
        <button id = <?= $this->myBindAttributes['id'] ?>
                class="k-button k-button-md k-button-rectangle k-rounded-md k-button-solid k-button-solid-base"
                button-role = "button"
                data-bind = "events: { click: <?= $this->myBindAttributes['action'] ?> }"
                style = "margin: 5px; padding: 5px">
        <?= $this->myBindAttributes['name'] ?>
        </button>
<?php
    }
}
