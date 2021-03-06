<?php


namespace CT\Controls;

use CT\Interfaces\IView;

class ToolBarView implements IView
{
    private array $myBindAttributes;
    private string $id;

    public function __construct(string $id, array $bindAttributes) {
        $this->myBindAttributes = $bindAttributes;
        $this->id = $id;
    }

    public function render()
    {
?>
        <div id = <?= $this->id ?> class = "horizontal_layout">
        <?php
            foreach ($this->myBindAttributes as $key => $buttonAttributes) {
                $myButton = new ButtonView($buttonAttributes);
                $myButton->render();
            }
        ?>
        </div>
<?php
    }
}
