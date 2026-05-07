<?php

declare(strict_types=1);

use Yiisoft\Router\Group;
use Yiisoft\Router\RouteCollection;
use Yiisoft\Router\RouteCollectionInterface;
use Yiisoft\Router\RouteCollector;

return [
    RouteCollectionInterface::class => static fn() => new RouteCollection(
        new RouteCollector()->addRoute(
            Group::create('/api')->routes(
                ...require(dirname(__DIR__, 2) . '/api/routes.php'),
            ),
            ...require(dirname(__DIR__, 2) . '/site/routes.php'),
        ),
    ),
];
