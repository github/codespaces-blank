<?php

declare(strict_types=1);

use App\Domain\Post\PostStatus;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use App\UseCase\Diary\Manage\Post\Update\Form;
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

$this->setTitle('Update post');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', urlName: 'diary/post/index'),
    new Breadcrumb('Manage', urlName: 'diary/manage/post/index'),
    new Breadcrumb('Update post'),
);

$field = new FieldFactory();
?>
<h1>Update Post</h1>
<div class="row mt-4">
    <div class="col-md-8">
        <?= $field->errorSummary($form)->onlyCommonErrors() ?>
        <?= Html::form()
            ->post($urlGenerator->postUpdate($form->post->getId()))
            ->csrf($csrf)
            ->open() ?>
        <?= $field->text($form, 'title') ?>
        <?= $field->textarea($form, 'body')->addInputAttributes(['rows' => 10]) ?>
        <?= $field->checkboxList($form, 'categoryIds')->items($form->categories)->uncheckValue('') ?>
        <?= $field->text($form, 'slug') ?>
        <?= $field->select($form, 'status')->optionsData(PostStatus::labelsByValue()) ?>
        <?= $field->date($form, 'publicationDate') ?>
        <?= $field->submitButton('Save')->afterInput(
            Html::a('Cancel', $urlGenerator->generate('diary/manage/post/index'), ['class' => 'btn btn-outline-secondary ms-2']),
        ) ?>
        <?= '</form>' ?>
    </div>
</div>
