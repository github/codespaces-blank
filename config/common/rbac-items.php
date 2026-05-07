<?php

declare(strict_types=1);

use App\Presentation\Site\Access\Permission;
use App\Presentation\Site\Access\Role;

return [
    ['name' => Permission::UserManage->value, 'type' => 'permission'],
    ['name' => Permission::DiaryManage->value, 'type' => 'permission'],

    /**
     * Admin
     */
    [
        'name' => Role::Admin->value,
        'description' => Role::Admin->label(),
        'type' => 'role',
        'children' => [
            Permission::UserManage->value,
            Permission::DiaryManage->value,
        ],
    ],

    /**
     * Editor
     */
    [
        'name' => Role::Editor->value,
        'description' => Role::Editor->label(),
        'type' => 'role',
        'children' => [
            Permission::DiaryManage->value,
        ],
    ],
];
