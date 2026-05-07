<?php

declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;
use PhpCsFixer\Runner\Parallel\ParallelConfigFactory;

ini_set('memory_limit', '512M');

$root = __DIR__;
$finder = new Finder()
    ->in([
        $root . '/config',
        $root . '/src',
        $root . '/tests',
    ])
    ->exclude([
        'Support/_generated',
    ])
    ->append([
        $root . '/public/index.php',
    ]);

return new Config()
    ->setCacheFile(__DIR__ . '/runtime/cache/.php-cs-fixer.cache')
    ->setParallelConfig(ParallelConfigFactory::detect())
    ->setRules([
        '@PER-CS3.0' => true,
        'no_unused_imports' => true,
    ])
    ->setFinder($finder);
