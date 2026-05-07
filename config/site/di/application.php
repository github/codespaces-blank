<?php

declare(strict_types=1);

use App\Presentation\Site\ResponseFactory\ExceptionResponderFactory;
use App\Presentation\Site\ResponseFactory\NotFoundMiddleware;
use Yiisoft\Csrf\CsrfTokenMiddleware;
use Yiisoft\Definitions\DynamicReference;
use Yiisoft\Definitions\Reference;
use Yiisoft\ErrorHandler\Middleware\ErrorCatcher;
use Yiisoft\Hydrator\TypeCaster\CompositeTypeCaster;
use Yiisoft\Hydrator\TypeCaster\HydratorTypeCaster;
use Yiisoft\Hydrator\TypeCaster\PhpNativeTypeCaster;
use Yiisoft\Input\Http\HydratorAttributeParametersResolver;
use Yiisoft\Input\Http\RequestInputParametersResolver;
use Yiisoft\Middleware\Dispatcher\CompositeParametersResolver;
use Yiisoft\Middleware\Dispatcher\MiddlewareDispatcher;
use Yiisoft\Middleware\Dispatcher\ParametersResolverInterface;
use Yiisoft\Router\Middleware\Router;
use Yiisoft\Session\SessionMiddleware;
use Yiisoft\User\Login\Cookie\CookieLoginMiddleware;
use Yiisoft\Yii\Http\Application;

/** @var array $params */

return [
    Application::class => [
        '__construct()' => [
            'dispatcher' => DynamicReference::to([
                'class' => MiddlewareDispatcher::class,
                'withMiddlewares()' => [
                    [
                        ErrorCatcher::class,
                        static fn(ExceptionResponderFactory $factory) => $factory->create(),
                        SessionMiddleware::class,
                        CookieLoginMiddleware::class,
                        CsrfTokenMiddleware::class,
                        Router::class,
                        NotFoundMiddleware::class,
                    ],
                ],
            ]),
        ],
    ],

    ParametersResolverInterface::class => [
        'class' => CompositeParametersResolver::class,
        '__construct()' => [
            DynamicReference::to([
                'class' => HydratorAttributeParametersResolver::class,
                '__construct()' => [
                    'typeCaster' => DynamicReference::to(
                        static fn() => new CompositeTypeCaster(
                            new PhpNativeTypeCaster(),
                            new HydratorTypeCaster(),
                        ),
                    ),
                ],
            ]),
            Reference::to(RequestInputParametersResolver::class),
        ],
    ],
];
