<?php

declare(strict_types=1);

use Yiisoft\ErrorHandler\Renderer\HtmlRenderer;

/**
 * @var array $params
 */

return [
    HtmlRenderer::class => [
        '__construct()' => [
            'traceLink' => $params['traceLink'] ?? null,
        ],
    ],
];
