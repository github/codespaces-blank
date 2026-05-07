<?php

declare(strict_types=1);

use App\Environment;
use Psr\Log\LogLevel;
use Yiisoft\ErrorHandler\ErrorHandler;
use Yiisoft\ErrorHandler\Renderer\HtmlRenderer;
use Yiisoft\ErrorHandler\Renderer\JsonRenderer;
use Yiisoft\Log\Logger;
use Yiisoft\Log\Target\File\FileTarget;
use Yiisoft\Yii\Runner\Http\HttpApplicationRunner;

$root = dirname(__DIR__);

require_once $root . '/src/autoload.php';

if (Environment::appC3()) {
    $c3 = $root . '/c3.php';
    if (file_exists($c3)) {
        require_once $c3;
    }
}

/**
 * @psalm-var string $_SERVER['REQUEST_URI']
 */
// PHP built-in server routing.
if (PHP_SAPI === 'cli-server') {
    // Serve static files as is.
    /** @var string $path */
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file(__DIR__ . $path)) {
        return false;
    }

    // Explicitly set for URLs with dot.
    $_SERVER['SCRIPT_NAME'] = '/index.php';
}

// Run HTTP application runner
if (str_starts_with($_SERVER['REQUEST_URI'], '/api/')) {
    new HttpApplicationRunner(
        rootPath: $root,
        debug: Environment::appDebug(),
        checkEvents: Environment::appDebug(),
        environment: Environment::appEnv(),
        bootstrapGroup: 'bootstrap-api',
        eventsGroup: 'events-api',
        diGroup: 'di-api',
        diProvidersGroup: 'di-providers-api',
        diDelegatesGroup: 'di-delegates-api',
        diTagsGroup: 'di-tags-api',
        paramsGroup: 'params-api',
        nestedParamsGroups: ['params', 'params-web'],
        nestedEventsGroups: ['events', 'events-web'],
        temporaryErrorHandler: new ErrorHandler(
            new Logger(
                [
                    new FileTarget($root . '/runtime/logs/api-container-building.log')
                        ->setLevels([
                            LogLevel::EMERGENCY,
                            LogLevel::ERROR,
                            LogLevel::WARNING,
                        ]),
                ],
            ),
            new JsonRenderer(),
        ),
    )->run();
}
new HttpApplicationRunner(
    rootPath: $root,
    debug: Environment::appDebug(),
    checkEvents: Environment::appDebug(),
    environment: Environment::appEnv(),
    bootstrapGroup: 'bootstrap-site',
    eventsGroup: 'events-site',
    diGroup: 'di-site',
    diProvidersGroup: 'di-providers-site',
    diDelegatesGroup: 'di-delegates-site',
    diTagsGroup: 'di-tags-site',
    paramsGroup: 'params-site',
    nestedParamsGroups: ['params', 'params-web'],
    nestedEventsGroups: ['events', 'events-web'],
    temporaryErrorHandler: new ErrorHandler(
        new Logger(
            [
                new FileTarget($root . '/runtime/logs/site-container-building.log')
                    ->setLevels([
                        LogLevel::EMERGENCY,
                        LogLevel::ERROR,
                        LogLevel::WARNING,
                    ]),
            ],
        ),
        new HtmlRenderer(),
    ),
)->run();
