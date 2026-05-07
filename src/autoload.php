<?php

declare(strict_types=1);

use App\Environment;

$root = dirname(__DIR__);

require_once $root . '/vendor/autoload.php';

Dotenv\Dotenv::createImmutable($root)->load();
Environment::prepare();
