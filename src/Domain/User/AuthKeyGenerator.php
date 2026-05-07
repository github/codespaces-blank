<?php

declare(strict_types=1);

namespace App\Domain\User;

use Yiisoft\Security\Random;

use function count;

final readonly class AuthKeyGenerator
{
    public function __construct(
        private int $length = 64,
        private int $duration = 432000, // 5 days
    ) {}

    public function generate(): string
    {
        return Random::string($this->length) . '~' . time();
    }

    public function validate(string $key, string $originKey): bool
    {
        if ($key !== $originKey) {
            return false;
        }

        $parts = explode('~', $key);
        if (count($parts) !== 2) {
            return false;
        }

        if ((time() - $this->duration) > (int) $parts[1]) {
            return false;
        }

        return true;
    }
}
