<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout;

use Yiisoft\Assets\AssetBundle;

final class MainAsset extends AssetBundle
{
    public ?string $basePath = '@assets/main';
    public ?string $baseUrl = '@assetsUrl/main';
    public ?string $sourcePath = '@assetsSource/main';

    public array $css = [
        'site.css',
    ];

    public array $depends = [
        BootstrapAsset::class,
        HtmxAsset::class,
    ];
}
