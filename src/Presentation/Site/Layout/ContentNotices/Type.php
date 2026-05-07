<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\ContentNotices;

enum Type: int
{
    case Success = 1;
    case Error = 2;

    public function class(): string
    {
        return match ($this) {
            self::Success => 'alert-success',
            self::Error => 'alert-danger',
        };
    }
}
