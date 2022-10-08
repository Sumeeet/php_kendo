<?php

namespace CT\Core\Lib;

use DOMDocument;
use DOMException;

class XMLRenderer
{
    /**
     * @throws DOMException
     */
    static public function render(string $path)
    {
        libxml_use_internal_errors(true);
        $file = self::canOpen($path);

        if(!$file) return;

        $doc = new DOMDocument();
        self::renderControls($file, $doc, $doc);
        print_r($doc->saveHTML());
    }

    /**
     * @throws DOMException
     */
    static private function renderControls($node, $doc, $parent) {
        foreach ($node->children() as $child) {
            $type = $child->getName();
            $attributes = self::makeAttributes($child->attributes());
            $control = ControlsFactory::create($type, $attributes, $child);
            // not all XML nodes are renderable i.e. columns
            if ($control) {
                $element = $control->render($doc);
                $parent->appendChild($element);
                self::renderControls($child, $doc, $element);
            }
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

    static private function makeAttributes($attributes): array
    {
        $attrArray = [];
        foreach ($attributes as $key => $value) {
            ($attrArray += [$key => $value]);
        }
        return $attrArray;
    }
}