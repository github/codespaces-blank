<?php

declare(strict_types=1);

namespace App\Domain\User;

enum UserStatus: int
{
    case Inactive = 0;
    case Active = 1;

    public function label(): string
    {
        return match ($this) {
            self::Inactive => 'Inactive',
            self::Active => 'Active',
        };
    }

    /**
     * @return array<int, string>
     */
    public static function labelsByValue(): array
    {
        $result = [];
        foreach (self::cases() as $type) {
            $result[$type->value] = $type->label();
        }
        return $result;
    }
}
