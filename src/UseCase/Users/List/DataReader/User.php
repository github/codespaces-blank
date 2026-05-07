<?php

declare(strict_types=1);

namespace App\UseCase\Users\List\DataReader;

use App\Domain\User\UserStatus;
use App\Presentation\Site\Access\Role;

final readonly class User
{
    /**
     * @param Role[] $roles
     */
    public function __construct(
        public int $id,
        public string $login,
        public string $name,
        public UserStatus $status,
        public array $roles,
    ) {}
}
