<?php

namespace CT\Core\Controls;

trait GridColumns
{
    public function makeAttributes($columns): array
    {
        $attributes = [];
        foreach ($columns->column as $column) {
            $col_attrs = [];
            foreach ($column->attributes() as $key => $value) {
                $col_attrs[$key] = (string)$value;
                $template = $this->getTemplate($key, $value, $column['field']);
                if ($template !== null) {
                    $col_attrs['template'] = $template;
                }
            }
            $attributes[] = $col_attrs;
        }
        return $attributes;
    }

    public function makeDynAttributes($columns, $columnCount): array
    {
        $attributes = $this->makeAttributes($columns);
        // add dynamic columns
        for ($count = 0; $count < $columnCount; $count++) {
            $attributes[] = [
                'field' => 'col'.$count,
                'title' => $count + 1,
                'width' => '50px'
            ];
        }
        return $attributes;
    }

    public function getTemplate($key, $value, $field): ?string
    {
        if ($key !== 'type') {
            return null;
        }

        $fieldName = (string)$field;
        return match ((string)$value) {
            'boolean' => "#= CT.Templates.getBooleanTemplate($fieldName)#",
            default => null
        };
    }
}
