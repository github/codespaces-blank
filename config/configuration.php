<?php

declare(strict_types=1);

use App\Environment;

// NOTE: After making changes in this file, run `composer yii-config-rebuild` to update the merge plan.
return [
    'config-plugin' => [
        'params' => 'common/params.php',
        'params-site' => [
            '$params',
            '$params-web',
            'site/params.php',
        ],
        'params-api' => [
            '$params',
            '$params-web',
            'api/params.php',
        ],
        'params-console' => [
            '$params',
            'console/params.php',
        ],
        'di' => 'common/di/*.php',
        'di-site' => [
            '$di',
            '$di-web',
            'site/di/*.php',
        ],
        'di-api' => [
            '$di',
            '$di-web',
            'api/di/*.php',
        ],
        'di-console' => '$di',
        'di-delegates' => [],
        'di-delegates-site' => '$di-delegates',
        'di-delegates-api' => '$di-delegates',
        'di-delegates-console' => '$di-delegates',
        'di-providers' => 'common/di-providers.php',
        'di-providers-site' => '$di-providers',
        'di-providers-api' => '$di-providers',
        'di-providers-console' => '$di-providers',
        'events' => [],
        'events-site' => [
            '$events',
            '$events-web',
        ],
        'events-api' => [
            '$events',
            '$events-web',
        ],
        'events-console' => '$events',
        'routes' => 'common/routes.php',
        'bootstrap' => 'common/bootstrap.php',
        'bootstrap-site' => '$bootstrap',
        'bootstrap-api' => '$bootstrap',
        'bootstrap-console' => '$bootstrap',
        'widgets-site' => 'site/widgets.php',
    ],
    'config-plugin-environments' => [
        Environment::DEV => [
            'params' => [
                'environments/dev/params.php',
            ],
        ],
        Environment::TEST => [
            'params' => [
                'environments/test/params.php',
            ],
        ],
        Environment::PROD => [
            'params' => [
                'environments/prod/params.php',
            ],
        ],
    ],
    'config-plugin-options' => [
        'source-directory' => 'config',
    ],
];
