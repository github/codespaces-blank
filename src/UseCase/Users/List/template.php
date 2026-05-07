<?php

declare(strict_types=1);

use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use App\UseCase\Users\List\UsersList;
use Yiisoft\Html\Html;
use Yiisoft\Html\NoEncode;
use Yiisoft\View\WebView;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 */

$this->setTitle('Users');
$this->addToParameter('breadcrumbs', new Breadcrumb('Users'));
?>
<div class="d-flex justify-content-between align-items-center">
    <h1>Users</h1>
    <?= Html::a(
        NoEncode::string('<i class="bi bi-person-plus me-1"></i> Create user'),
        $urlGenerator->generate('user/create'),
        ['class' => 'btn btn-outline-primary btn-sm'],
    ) ?>
</div>
<?= UsersList::widget() ?>
