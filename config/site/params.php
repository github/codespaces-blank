<?php

declare(strict_types=1);

use App\Environment;
use App\Presentation\Site\Layout\Form\FormTheme;

return [
    'yiisoft/form' => [
        'themes' => [
            FormTheme::VERTICAL => require __DIR__ . '/form-bootstrap5-vertical.php',
            FormTheme::HORIZONTAL => require __DIR__ . '/form-bootstrap5-horizontal.php',
        ],
        'defaultTheme' => FormTheme::HORIZONTAL,
    ],

    'yiisoft/widget' => [
        'config' => [
            'definitionsGroup' => 'widgets-site',
            'validate' => Environment::appDebug(),
        ],
        'defaultTheme' => 'bootstrap5',
    ],
];
