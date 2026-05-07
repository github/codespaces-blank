<?php

declare(strict_types=1);

namespace App\Presentation\Site\Identity;

use App\Domain\User\AuthKeyGenerator;
use App\Domain\User\User;
use Yiisoft\Auth\IdentityInterface;
use Yiisoft\Auth\IdentityRepositoryInterface;

final readonly class IdentityRepository implements IdentityRepositoryInterface
{
    public function __construct(
        private AuthKeyGenerator $authKeyGenerator,
    ) {}

    public function findIdentity(string $id): ?IdentityInterface
    {
        /** @var User|null $user */
        $user = User::query()->findByPk($id);
        if ($user === null || !$user->canSignIn()) {
            return null;
        }

        return new UserIdentity($user, $this->authKeyGenerator);
    }
}
