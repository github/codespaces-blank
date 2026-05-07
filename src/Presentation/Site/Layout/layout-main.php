<?php

declare(strict_types=1);

use App\Presentation\Site\Access\Permission;
use App\Presentation\Site\Identity\UserIdentity;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumbs;
use App\Presentation\Site\Layout\ContentNotices\ContentNoticesWidget;
use App\Presentation\Site\Layout\MainAsset;
use App\Presentation\Site\Layout\Menu\Item;
use App\Presentation\Site\Layout\Menu\MainMenu;
use App\Shared\UrlGenerator;
use Yiisoft\Html\Html;
use Yiisoft\Router\CurrentRoute;
use Yiisoft\User\CurrentUser;
use Yiisoft\Yii\View\Renderer\Csrf;

/**
 * @var Yiisoft\View\WebView $this
 * @var Yiisoft\Aliases\Aliases $aliases
 * @var Yiisoft\Assets\AssetManager $assetManager
 * @var string $content
 * @var Csrf $csrf
 * @var UrlGenerator $urlGenerator
 * @var CurrentUser $currentUser
 */

$assetManager->register(MainAsset::class);

$this->addCssFiles($assetManager->getCssFiles());
$this->addCssStrings($assetManager->getCssStrings());
$this->addJsFiles($assetManager->getJsFiles());
$this->addJsStrings($assetManager->getJsStrings());
$this->addJsVars($assetManager->getJsVars());

$this->beginPage()
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="<?= $aliases->get('@baseUrl/favicon.svg') ?>" type="image/svg+xml">
    <?= Html::title($this->getTitle()) ?>
    <?php $this->head() ?>
</head>
<body class="d-flex flex-column min-vh-100">
<?php $this->beginBody() ?>
<div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0">
            <a href="<?= Html::encodeAttribute($urlGenerator->home()) ?>" class="d-inline-flex text-decoration-none">
                <?= Html::img(
                    $assetManager->getUrl(MainAsset::class, 'logo.svg'),
                    'Yii3 Demo Diary',
                    ['height' => 40],
                ) ?>
            </a>
        </div>
        <?= MainMenu::widget([
            'items' => [
                new Item('Home', urlName: 'home'),
                new Item(
                    'Diary',
                    urlName: 'diary/post/index',
                    activeCallback: static fn(CurrentRoute $currentRoute) => str_starts_with($currentRoute->getName() ?? '', 'diary/'),
                ),
                new Item(
                    'Users',
                    urlName: 'user/index',
                    permission: Permission::UserManage,
                    activeCallback: static fn(CurrentRoute $currentRoute) => str_starts_with($currentRoute->getName() ?? '', 'user/'),
                ),
            ],
        ]) ?>
        <div class="col-md-3 d-flex align-items-center justify-content-end">
            <?php if ($currentUser->isGuest()) { ?>
                <?= Html::a('Sign in', $urlGenerator->login(), ['class' => 'btn btn-outline-primary me-2']) ?>
            <?php } else { ?>
                <?php
                /** @var UserIdentity $identity */
                $identity = $currentUser->getIdentity();
                ?>
                <span class="me-2">
                    <?= Html::encode($identity->user->name) ?>
                </span>
                <div class="dropdown text-end">
                    <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-circle fs-3"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end text-small">
                        <li>
                            <?= Html::a('Update profile', $urlGenerator->profileUpdate(), ['class' => 'dropdown-item']) ?>
                        </li>
                        <li>
                            <?= Html::a('Change password', $urlGenerator->profileChangePassword(), ['class' => 'dropdown-item']) ?>
                        </li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li>
                            <form action="<?= Html::encodeAttribute($urlGenerator->logout()) ?>" method="post">
                                <?= $csrf->hiddenInput() ?>
                                <button type="submit" class="dropdown-item">Sign out</button>
                            </form>
                        </li>
                    </ul>
                </div>
            <?php } ?>
        </div>
    </header>
    <?= Breadcrumbs::widget([
        'breadcrumbs' => $this->getParameter('breadcrumbs', []),
    ]) ?>
    <?= ContentNoticesWidget::widget() ?>
</div>
<div class="container flex-grow-1">
    <?= $content ?>
</div>
<div class="container">
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4 border-top">
        <div class="col-md-4 d-flex align-items-center">
            <span class="mb-3 mb-md-0 text-body-secondary">Yii3 Demo Diary</span>
        </div>
        <ul class="nav col-md-4 justify-content-end list-unstyled d-flex fs-3">
            <li class="ms-3">
                <a class="link-secondary" href="https://github.com/yiisoft/demo-diary" title="GitHub">
                    <i class="bi bi-github"></i>
                </a>
            </li>
        </ul>
    </footer>
</div>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
