<?php

declare(strict_types=1);

use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use App\UseCase\Diary\Manage\Category\Create\Form;
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

$this->setTitle('New category');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', urlName: 'diary/post/index'),
    new Breadcrumb('Manage', urlName: 'diary/manage/post/index'),
    new Breadcrumb('Categories', urlName: 'diary/manage/category/index'),
    new Breadcrumb('New category'),
);

$field = new FieldFactory();
?>
<h1>Create Category</h1>
<div class="row mt-4">
    <div class="col-md-8">
        <?= $field->errorSummary($form)->onlyCommonErrors() ?>
        <?= Html::form()
            ->post($urlGenerator->generate('diary/manage/category/create'))
            ->csrf($csrf)
            ->open() ?>
        <?= $field->text($form, 'name') ?>
        <?= $field->textarea($form, 'description')->addInputAttributes(['rows' => 3]) ?>
        <?= $field->text($form, 'slug') ?>
        <?= $field->submitButton('Create')->afterInput(
            Html::a('Cancel', $urlGenerator->generate('diary/manage/category/index'), ['class' => 'btn btn-outline-secondary ms-2']),
        ) ?>
        <?= '</form>' ?>
    </div>
</div>
