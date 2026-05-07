<?php

declare(strict_types=1);

use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use App\UseCase\Profile\ChangePassword\Form;
use Yiisoft\FormModel\FieldFactory;
use Yiisoft\Html\Html;
use Yiisoft\View\WebView;
use Yiisoft\Yii\View\Renderer\Csrf;

/**
 * @var WebView $this
 * @var Csrf $csrf
 * @var UrlGenerator $urlGenerator
 * @var Form $form
 */

$this->setTitle('Profile / Change password');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Profile'),
    new Breadcrumb('Change password'),
);

$field = new FieldFactory();
?>
<h1>Change password</h1>
<div class="row mt-4">
    <div class="col-md-6">
        <?= $field->errorSummary($form)->onlyCommonErrors() ?>
        <?= Html::form()
            ->post($urlGenerator->profileChangePassword())
            ->csrf($csrf)
            ->open() ?>
        <?= $field->password($form, 'current') ?>
        <?= $field->password($form, 'new') ?>
        <?= $field->password($form, 'new2') ?>
        <?= $field->submitButton('Save') ?>
        <?= '</form>' ?>
    </div>
</div>
