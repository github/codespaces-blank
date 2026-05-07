<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout;

use Yiisoft\Assets\AssetBundle;

/**
 * @see https://htmx.org/docs/#installing
 */
final class HtmxAsset extends AssetBundle
{
    public bool $cdn = true;

    public array $js = [
        'https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js',
    ];

    public array $jsOptions = [
        'integrity' => 'sha384-/TgkGk7p307TH7EXJDuUlgG3Ce1UVolAOFopFekQkkXihi5u/6OCvVKyz1W+idaz',
        'crossorigin' => 'anonymous',
    ];
}
