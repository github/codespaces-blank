<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\Breadcrumbs;

use Stringable;

final readonly class Breadcrumb
{
    /**
     * @param array<string, null|Stringable|scalar> $urlParameters
     */
    public function __construct(
        public string|Stringable $label,
        public ?string $customUrl = null,
        public ?string $urlName = null,
        public array $urlParameters = [],
    ) {}
}
