<?php

declare(strict_types=1);

namespace App\Domain\Post;

enum PostStatus: int
{
    case Draft = 0;
    case Published = 1;
    case Archived = 2;

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Published => 'Published',
            self::Archived => 'Archived',
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
