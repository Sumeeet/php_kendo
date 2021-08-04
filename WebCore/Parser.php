<?php

/**
 * Read ftx file and generate key-value pairs.
 * Search generated keys in json file and replace
 * with values corresponding to keys in ftx. If keys are
 * not found then check auxiliary json structure which has
 * prefilled ftx-key to json-key mapping.
 * 
 */

 class Ftx2Json {

     private static $KEY_FOUND = 'keyFound';
     private static $MAPPED_KEY = 'mappedKey';
     private static $VALUE = 'value';
     private static $INVALID_COMB = 'InvalidParamComb';

     /**
      * Generate json file by copying values in ftx file to new json file,
      * using existing json definition as a template. Keys not found in
      * definition file are maintained separately in keys_not_found.json.
      * This file is represented to the user where manual mapping can be done.
      * Once manual mapping is done, this file is scanned in second pass to
      * find any un-mapped key and check if manual mapping is defined.
      *
      * @param $ftxFile
      * @param $jsonFile
      */
     static public function createJson(array $ftxFile, array $jsonFile) {
         $ftxContent = self::readFtxFile($ftxFile);
         if (is_null($ftxContent)) return;

         $jsonContent = self::readJsonFile($jsonFile);
         if (is_null($jsonContent)) return;

         $notFound = [];
         foreach ($ftxContent as $key => $value) {
             $ftxValue = self::toValue($value);
             if (!self::updateJsonAux($key, $ftxValue,$jsonContent)) {
                 $notFound += [$key => [self::$VALUE => $ftxValue, self::$MAPPED_KEY => '',
                     self::$KEY_FOUND => false ]];
             }
         }

         // if keys are already mapped then pick those values
         if (file_exists('keys_not_found.json')) {
             $mappedContent = json_decode(file_get_contents('keys_not_found.json'), true);
             if (!is_null($mappedContent)) {
                 foreach ($mappedContent as $key => $value) {
                     $notFound[$key][self::$MAPPED_KEY] = $value[self::$MAPPED_KEY];
                     $notFound[$key][self::$KEY_FOUND]
                         = self::updateJsonAux1($notFound[$key][self::$MAPPED_KEY],
                         $notFound[$key][self::$VALUE], $jsonContent);
                 }
             }
         }

         file_put_contents('new_test_module_def.json',
             json_encode($jsonContent, JSON_PRETTY_PRINT));
         file_put_contents('keys_not_found.json',
             json_encode($notFound, JSON_PRETTY_PRINT));
         print_r(json_encode(['message' => 'JSON generated successfully',
             'json_result' => $jsonContent,'ftx_result' => $ftxContent],
             JSON_PRETTY_PRINT));
 }

     /**
      * @param array $data
      */
     static public function updateJson(array $data) {
         if (is_null($data)) return;

         $notFound = json_decode(file_get_contents('keys_not_found.json'), true);
         if (is_null($notFound)) return;

         $replace = function($string) { return trim(str_replace(['{', '"'], '', $string)); };
         $makeKey = function($array) use ($replace) { return implode('.', array_map($replace, $array)); };

         // fill in the mapped keys in ftxContent and update not found json
         foreach ($notFound as $key => $value) {
             if (isset($data[$key])) {
                 $array = explode(':', $data[$key]);
                 $notFound[$key][self::$MAPPED_KEY] = $makeKey($array);
             }
         }

         $jsonContent = json_decode(file_get_contents('new_test_module_def.json'), true);
         if (is_null($jsonContent)) return;

         foreach ($notFound as $key => $value) {
             $newValue = self::toValue($value[self::$VALUE]);
             $notFound[$key][self::$KEY_FOUND] = self::updateJsonAux1($value[self::$MAPPED_KEY],
                 $newValue,$jsonContent);
         }

         file_put_contents('keys_not_found.json',
             json_encode($notFound, JSON_PRETTY_PRINT));
         file_put_contents('new_test_module_def.json',
             json_encode($jsonContent, JSON_PRETTY_PRINT));
         print_r(json_encode(['message' => 'JSON generated successfully',
             'json_result' => $jsonContent],JSON_PRETTY_PRINT));
     }

     /**
      * @param array $file
      *
      * @return array|string[]|null
      */
     static private function readFtxFile(array $file) {
         try {
             if (!self::isFileValid($file)) return [];

             $fileHandle = fopen($file['tmp_name'], 'r');
             $fileContent = [];
             $fileSubContent = [];
             $fullLine = '';
             $key = '';

             $isBlockStart = function($string) { return self::endsWith($string, '{'); };
             $isBlockEnd = function($string) { return self::startsWith($string, '}'); };
             $isComment = function($string) { return self::startsWith($string, '//'); };
             $isEol = function($string) { return self::endsWith($string, ';'); };
             $isCommaSeparated = function($string) { return strpos($string, ','); };
             $removeCommas = function($string) { return str_replace('"', '', $string); };

             while ($line = fgets($fileHandle)) {
                 $line = trim($line);
                 // ignore empty lines and comments
                 if ($line === '' || $isComment($line)) {
                     continue;
                 }

                 if ($isBlockStart($line)) {
                     $key = self::substrByChar($line,':');
                     if ($key === self::$INVALID_COMB) {
                         $fileContent[$key] = [];
                     }
                 } else if ($isBlockEnd($line)) {
                     if ($key ===self::$INVALID_COMB) {
                         $fileContent[$key] = $fileSubContent;
                         $fileSubContent = [];
                     }
                 } else if ($isEol($line)) {
                     // check if line ends with ';', if it doesn't then
                     // go to next line and repeat. ';' is an end of line
                     $fullLine = $fullLine . $line;
                     $subKey = self::substrByChar($fullLine,':');
                     $value = self::substrByCharRange($fullLine,':', ';');

                     // special case for invalid parameter combination
                     if ($key === self::$INVALID_COMB) {
                         array_push($fileSubContent, $removeCommas($value));
                     } else if ($isCommaSeparated($value)) {
                         // comma separated string is treated as array in definition json
                         $fileContent += [$subKey => explode(',', $removeCommas($value))];
                     } else {
                         $fileContent += [$subKey => $value];
                     }
                     $fullLine = '';
                 } else {
                     $fullLine = $fullLine . $line;
                 }
             }
             return $fileContent;
         }
         catch (RuntimeException $e) {
             print_r(json_encode(['error' => $e->getMessage()],
                 JSON_PRETTY_PRINT));
         }
         return null;
     }

     /**
      * @param array $file
      *
      * @return array|mixed|null
      */
     static private function readJsonFile(array $file) {
         try {
             if (!self::isFileValid($file)) return [];
             return json_decode(file_get_contents($file['tmp_name']), true);
         }
         catch (RuntimeException $e) {
             print_r(json_encode(['error' => $e->getMessage()],
                 JSON_PRETTY_PRINT));
         }
         return null;
     }

     /**
      * @param $haystack
      * @param $needle
      *
      * @return bool
      */
     private static function startsWith($haystack, $needle) {
         return (substr($haystack, 0, strlen($needle)) === $needle);
     }

     /**
      * @param $haystack
      * @param $needle
      *
      * @return bool
      */
     private static function endsWith($haystack, $needle) {
         $nLength = strlen($needle);
         $hLength = strlen($haystack);
         $start = $hLength - $nLength;
         return (substr($haystack, $start, $nLength) === $needle);
     }

     /**
      * @param array $file
      *
      * @return bool
      */
     private static function isFileValid(array $file) {
         // Undefined | Multiple Files | $_FILES Corruption Attack
         // If this request falls under any of them, treat it invalid.
         if (!isset($file['error'])
             || is_array($file['error'])
         ) {
             throw new RuntimeException('Invalid parameters.');
         }

         switch ($file['error']) {
             case UPLOAD_ERR_OK:
                 break;
             case UPLOAD_ERR_NO_FILE:
                 throw new RuntimeException('No file sent.');
             case UPLOAD_ERR_INI_SIZE:
             case UPLOAD_ERR_FORM_SIZE:
                 throw new RuntimeException('Exceeded filesize limit.');
             default:
                 throw new RuntimeException('Unknown errors.');
         }

         // You should also check filesize here.
         if ($file['size'] > 1000000) {
             throw new RuntimeException('Exceeded filesize limit.');
         }

         $extensions = ['json', 'ftx'];
         $fileExtension = strtolower(self::substrByCharRange($file['name'], '.', ''));
         if (!in_array($fileExtension, $extensions)) {
             throw new RuntimeException('Invalid file format:' . $file["name"] . $file["type"]);
         }

         return true;
     }

     /**
      * @param $string
      * @param $start_char
      * @param $end_char
      *
      * @return string
      */
     private static function substrByCharRange($string, $start_char, $end_char) {
         $start = strpos($string, $start_char) + 1;
         $end = $end_char === '' ? strlen($string) : strpos($string, $end_char);
         $length = $end - $start;
         return trim(substr($string, $start, $length));
     }

     /**
      * @param $string
      * @param $char
      * @param $offset
      *
      * @return string
      */
     private static function substrByChar($string, $char, $offset = 0) {
         $length = strpos($string, $char);
         return trim(substr($string, $offset, $length));
     }

     private static function substrByRevChar($string, $char, $offset = -1) {
         $length = strrpos($string, $char);
         return trim(substr($string, $offset, $length));
     }

     /**
      * @param $value
      *
      * @return false|mixed
      */
     private static function toValue($value) {
         list($isBool, $boolValue) = self::isBoolString($value);
         if ($isBool) return $boolValue;
         return $value;
     }

     /**
      * @param $string
      *
      * @return array|false[]
      */
     private static function isBoolString($string) {
         if (!is_string($string)) return [false, false];
         $toBool = function($string) { return $string === 'true'; };
         $lowerString = strtolower($string);
         if ($lowerString === 'true' || $lowerString === 'false') {
             return [true, $toBool($lowerString)];
         }
         return [false, false];
     }

     private static  function setValue($key, $value, & $jsonContent) {
         // check if data type of existing value in json def is
         // an array, convert value to an array if its not already
         $jsonContent[$key] = !is_array($jsonContent[$key]) ?
             $value : (!is_array($value) ? [$value] : $value);
         return true;
     }

     private static function setFreqValue($key, $value, & $jsonContent) {
         // special check for Frequency in Storage
         // Syntax: xx/aa,bb,...,ee
         // where: xx is standard frequency
         // aa,bb,...,ee are available frequency
         // extract default (standard frequency)
         if (!is_array($value)) {
             $frequencies = explode('/', $value);
             $jsonContent['default'] = $frequencies[0];
             $jsonContent[$key] = $frequencies[1];
         } else {
             $frequencies = explode('/', $value[0]);
             $jsonContent['default'] = $frequencies[0];
             $value[0] = $frequencies[1];
             $jsonContent[$key] = $value;
         }
         return true;
     }

     /**
      * @param       $searchKey
      * @param       $value
      * @param       $jsonContent
      * @param false $updated
      * @param int   $depth
      * @param       $maxDepth
      *
      * @return bool
      */
     private static function updateJsonAux($searchKey, $value, & $jsonContent,
         $updated = false, $depth = 0, $maxDepth = INF) {
         if ($depth > $maxDepth) return false;

         $keys = array_keys($jsonContent);
         foreach ($keys as $key) {
             if (is_array($jsonContent[$key])) {
                 if (!array_key_exists($searchKey, $jsonContent[$key])) {
                     $updated = self::updateJsonAux($searchKey, $value,
                         $jsonContent[$key], $updated, ++$depth);
                 } else {
                     return self::setValue($searchKey, $value, $jsonContent[$key]);
                 }
             }
         }
         return $updated;
     }

     private static function updateJsonAux1($searchKey, $value, &$jsonContent,
         $currentKey = '', $updated = false, $depth = 0, $maxDepth = INF) {
         if ($depth > $maxDepth) return false;

         $keys = array_keys($jsonContent);
         foreach ($keys as $key) {
             if (is_array($jsonContent[$key])) {
                 $tempKey = $currentKey === '' ? $key : $currentKey . '.' . $key;
                 if (!strrpos($tempKey, $searchKey)) {
                     $updated = self::updateJsonAux1($searchKey, $value,
                         $jsonContent[$key],
                         $tempKey, $updated, ++$depth);
                 } else {
                     if (strpos($tempKey, 'frq.all') ||
                         strpos($tempKey, 'DefaultFrequenzy.all')) {
                         return self::setFreqValue($key, $value, $jsonContent);
                     } else {
                         return self::setValue($key, $value, $jsonContent);
                     }
                 }
             } else {
                 $tempKey = $currentKey . '.'. $key;
                 if (strrpos($tempKey, $searchKey)) {
                     return self::setValue($key, $value, $jsonContent);
                 }
             }
         }
         return $updated;
     }
 }