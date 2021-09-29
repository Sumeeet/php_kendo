<?php

namespace CT\WebCore;

/**
 * Read ftx file and generate key-value pairs.
 * Search generated keys in json file and replace
 * with values corresponding to keys in ftx. If keys are
 * not found then check auxiliary json structure which has
 * prefilled ftx-key to json-key mapping.
 * 
 */

 class JsonParser {

     /**
      * @param string $file
      *
      * @return array|mixed|null
      */
     static public function readJsonFile(string $file) {
         try {
             if (!file_exists($file)) return 'file not found';
             return json_decode(file_get_contents($file), true);
         }
         catch (RuntimeException $e) {
             print_r(json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT));
         }
         return '';
     }
 }