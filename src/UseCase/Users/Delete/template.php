<?php

declare(strict_types=1);

use App\Domain\User\User;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Presentation\Site\Widget\ShortUserInfo;
use App\Shared\UrlGenerator;
use Yiisoft\Html\Html;
use Yiisoft\View\WebView;
use Yiisoft\Yii\View\Renderer\Csrf;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var Csrf $csrf
 * @var User $user
 */

$this->setTitle('Delete user "' . $user->login . '"');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Users', $urlGenerator->generate('user/index')),
    new Breadcrumb('Delete user'),
);
?>
<h1>Delete user "<?= Html::encode($user->login) ?>"?</h1>
<div class="container-fluid mt-4">
    <?= ShortUserInfo::widget([$user]) ?>
    <?= Html::form()
        ->post($urlGenerator->generate('user/delete', ['id' => $user->getId()]))
        ->csrf($csrf)
        ->open() ?>
    <?= Html::submitButton('Delete', ['class' => 'btn btn-danger']) ?>
    <?= '</form>' ?>
</div>
