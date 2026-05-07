<?php

declare(strict_types=1);

use App\Shared\UrlGenerator;
use Yiisoft\Html\Html;
use Yiisoft\Router\CurrentRoute;
use Yiisoft\View\WebView;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var CurrentRoute $currentRoute
 * @var string $message
 */

$this->setTitle('Error');
?>
<div class="text-center">
    <h1>Error</h1>
    <?php
    if ($message !== '') {
        echo Html::p($message);
    }
?>
    <p>
        <a href="<?= $urlGenerator->home() ?>">Go Home</a>
    </p>
</div>
