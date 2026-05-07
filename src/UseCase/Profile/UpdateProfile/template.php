<?php

declare(strict_types=1);

use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use App\UseCase\Profile\UpdateProfile\Form;
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

$this->setTitle('Profile / Update profile');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Profile'),
    new Breadcrumb('Update'),
);

$field = new FieldFactory();
?>
<h1>Update profile</h1>
<div class="row mt-4">
    <div class="col-md-6">
        <?= $field->errorSummary($form)->onlyCommonErrors() ?>
        <?= Html::form()
            ->post($urlGenerator->profileUpdate())
            ->csrf($csrf)
            ->open() ?>
        <?= $field->text($form, 'name') ?>
        <?= $field->submitButton('Save') ?>
        <?= '</form>' ?>
    </div>
</div>
