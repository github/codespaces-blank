<?php

declare(strict_types=1);

namespace App\Presentation\Site\Identity;

use LogicException;
use Yiisoft\User\CurrentUser;

final readonly class AuthenticatedUserProvider
{
    public function __construct(
        private CurrentUser $currentUser,
    ) {}

    public function getId(): int
    {
        $rawId = $this->currentUser->getId();
        if ($rawId === null) {
            throw new LogicException('User is not authenticated.');
        }

        return (int) $rawId;
    }
}
