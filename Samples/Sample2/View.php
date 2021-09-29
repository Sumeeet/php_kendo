<?php

namespace CT\Samples\Sample2;

use CT\Controls\GridView;
use CT\Interfaces\IView;
use CT\WebCore\JsonParser;


class View implements IView
{
    private string $gridInfo;
    public function __construct() {
        $column_info = JsonParser::readJsonFile(__DIR__ . '\GridInfo.json');
        $this->gridInfo = json_encode($column_info["ColumnInfo"]);
    }

    public function render()
    {
        $grid = new GridView(['attribute' => 'GridModel',
            'columnInfo' => $this->gridInfo,
            'gridId' => 'gridId']);

        echo <<<HTML
        <div>{$grid->render()}</div>
        HTML;
    }
}
