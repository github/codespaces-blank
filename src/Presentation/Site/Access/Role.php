<?php

declare(strict_types=1);

namespace App\Presentation\Site\Access;

enum Role: string
{
    case Admin = 'admin';
    case Editor = 'editor';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Editor => 'Editor',
        };
    }

    /**
     * @return array<string, string>
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
