<?php

declare(strict_types=1);

use App\Domain\Category\Category;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use Yiisoft\Html\Html;
use Yiisoft\View\WebView;
use Yiisoft\Yii\View\Renderer\Csrf;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var Csrf $csrf
 * @var Category $category
 */

$this->setTitle('Delete category "' . $category->name . '"');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', urlName: 'diary/post/index'),
    new Breadcrumb('Manage', urlName: 'diary/manage/post/index'),
    new Breadcrumb('Categories', urlName: 'diary/manage/category/index'),
    new Breadcrumb('Delete category'),
);
?>
<h1>Delete category "<?= Html::encode($category->name) ?>"?</h1>
<div class="container-fluid mt-4">
    <div class="border rounded p-3 bg-light mb-3">
        <strong>ID:</strong> <?= Html::encode($category->getId()) ?><br>
        <strong>Slug:</strong> <?= Html::encode($category->slug) ?>
    </div>
    <div class="alert alert-warning">
        <strong>Warning:</strong> Deleting this category will remove it from all posts that use it.
    </div>
    <div class="mt-4">
        <?= Html::form()
            ->post($urlGenerator->generate('diary/manage/category/delete', ['id' => $category->getId()]))
            ->csrf($csrf)
            ->open() ?>
        <?= Html::submitButton('Delete', ['class' => 'btn btn-danger']) ?>
        <?= Html::a('Cancel', $urlGenerator->generate('diary/manage/category/index'), ['class' => 'btn btn-outline-secondary']) ?>
        <?= '</form>' ?>
    </div>
</div>
