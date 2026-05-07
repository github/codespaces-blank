<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\Menu;

final readonly class HandledItem
{
    public function __construct(
        public string $label,
        public ?string $url,
        public bool $active,
    ) {}
}
