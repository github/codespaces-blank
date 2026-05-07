<?php

declare(strict_types=1);

namespace App\Presentation\Site\Identity;

use App\Domain\User\AuthKeyGenerator;
use App\Domain\User\User;
use Yiisoft\User\Login\Cookie\CookieLoginIdentityInterface;

final readonly class UserIdentity implements CookieLoginIdentityInterface
{
    public function __construct(
        public User $user,
        private AuthKeyGenerator $authKeyGenerator,
    ) {}

    public function getId(): string
    {
        return (string) $this->user->getId();
    }

    public function getCookieLoginKey(): string
    {
        return $this->user->auth_key;
    }

    public function validateCookieLoginKey(string $key): bool
    {
        return $this->authKeyGenerator->validate($key, $this->user->auth_key);
    }
}
