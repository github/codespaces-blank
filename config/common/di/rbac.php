<?php

declare(strict_types=1);

use Yiisoft\Definitions\DynamicReference;
use Yiisoft\Rbac\Db\AssignmentsStorage;
use Yiisoft\Rbac\Manager;
use Yiisoft\Rbac\ManagerInterface;
use Yiisoft\Rbac\Php\ItemsStorage;

return [
    ManagerInterface::class => [
        'class' => Manager::class,
        '__construct()' => [
            'itemsStorage' => DynamicReference::to([
                'class' => ItemsStorage::class,
                '__construct()' => [dirname(__DIR__) . '/rbac-items.php'],
            ]),
            'assignmentsStorage' => DynamicReference::to(AssignmentsStorage::class),
        ],
    ],
];
