<?php

declare(strict_types=1);

use App\Presentation\Site\Access\Role;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use App\UseCase\Users\Create\Form;
use Yiisoft\FormModel\FieldFactory;
use Yiisoft\Html\Html;
use Yiisoft\View\WebView;
use Yiisoft\Yii\View\Renderer\Csrf;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var Csrf $csrf
 * @var Form $form
 */

$this->setTitle('New user');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Users', $urlGenerator->generate('user/index')),
    new Breadcrumb('New user'),
);

$field = new FieldFactory();
?>
<h1>New User</h1>
<div class="row mt-4">
    <div class="col-md-6">
        <?= $field->errorSummary($form)->onlyCommonErrors() ?>
        <?= Html::form()
            ->post($urlGenerator->generate('user/create'))
            ->csrf($csrf)
            ->open() ?>
        <?= $field->text($form, 'login') ?>
        <?= $field->text($form, 'name') ?>
        <?= $field->password($form, 'password') ?>
        <?= $field->select($form, 'role')->optionsData(Role::labelsByValue())->prompt('— Select —') ?>
        <?= $field->submitButton('Create')->afterInput(
            Html::a('Cancel', $urlGenerator->generate('user/index'), ['class' => 'btn btn-outline-secondary ms-2']),
        ) ?>
        <?= '</form>' ?>
    </div>
</div>
