<?php

namespace CT\WebCore;

use CT\Controls\ButtonView;
use CT\Controls\GridView;
use CT\Controls\LabelView;
use CT\Controls\NumericTextView;
use CT\Controls\TextView;
use JetBrains\PhpStorm\Pure;

class XMLRenderer
{
    static public function render(string $path)
    {
        libxml_use_internal_errors(true);
        $file = self::canOpen($path);

        if(!$file) return;

        //$file->components->children()[0]->attributes()
        self::renderControls($file->components);
    }

    static private function renderControls($root) {
        // TODO: Draw nested div tags for layouts
        foreach ($root->children() as $child) {
            $type = $child->getName();
            $attributes = self::isGroup($type) ?
                self::makeGroupAttributes($child->attributes()):
                self::makeAttributes($child->attributes());

            $control = ControlsFactory::create($type, $attributes);
            self::renderControls($child);
            $control?->render();
        }
    }

    static private function canOpen(string $path) {
        if (!file_exists($path)) {
            echo "File path:" . $path . "doesn't exist";
            return false;
        }

        $file = simplexml_load_file($path);

        if (!$file) {
            echo "Failed loading XML:";
            foreach (libxml_get_errors() as $error) {
                echo "<br>", $error->message;
            }
        }

        return $file;
    }

    #[Pure] static private function makeAttributes($attributes): array
    {
        $attrArray = [];
        foreach ($attributes as $key => $value) {
            ($attrArray += [$key => $value]);
        }
        return $attrArray;
    }

    #[Pure] static private function makeGroupAttributes($attributes): array
    {
        $attrArray = [];
        foreach ($attributes as $key => $value) {
            $attrArray +=  match ($key) {
                'layout' => (['class' => $value.'_'.$key]),
                default => ([$key => $value]),
            };
        }
        return $attrArray;
    }

    static private function isGroup(string $controlType): bool
    {
        return match ($controlType) {
            'group' => true,
            default => false,
        };
    }
}