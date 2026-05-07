<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\Menu;

use App\Presentation\Site\Access\Permission;
use Closure;
use Stringable;

final readonly class Item
{
    /**
     * @param array<string, null|Stringable|scalar> $urlParameters
     */
    public function __construct(
        public string $label,
        public ?string $urlName = null,
        public array $urlParameters = [],
        public ?string $customUrl = null,
        public ?Permission $permission = null,
        public ?Closure $activeCallback = null,
    ) {}
}
