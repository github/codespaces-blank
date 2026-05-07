<?php

declare(strict_types=1);

use App\Presentation\Site\Identity\IdentityRepository;
use Yiisoft\Auth\IdentityRepositoryInterface;
use Yiisoft\Definitions\Reference;
use Yiisoft\Rbac\ManagerInterface;
use Yiisoft\Session\SessionInterface;
use Yiisoft\User\CurrentUser;

return [
    CurrentUser::class => [
        'withSession()' => [Reference::to(SessionInterface::class)],
        'withAccessChecker()' => [Reference::to(ManagerInterface::class)],
    ],

    IdentityRepositoryInterface::class => IdentityRepository::class,
];
