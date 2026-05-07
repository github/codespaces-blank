<?php

declare(strict_types=1);

use App\Shared\UrlGenerator;
use Yiisoft\Router\CurrentRoute;
use Yiisoft\View\WebView;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var CurrentRoute $currentRoute
 */

$this->setTitle('Access Denied');
?>
<div class="text-center">
    <h1>Access Denied</h1>
    <p>
        <a href="<?= $urlGenerator->home() ?>">Go Home</a>
    </p>
</div>
