<?php

declare(strict_types=1);

use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use App\UseCase\Diary\Manage\Category\Listing\DataReader\Category;
use App\UseCase\Diary\Manage\Category\Listing\DataReader\CategoryDataReader;
use App\UseCase\Diary\Manage\Category\Listing\NameFilterFactory;
use Yiisoft\Html\Html;
use Yiisoft\Html\NoEncode;
use Yiisoft\View\WebView;
use Yiisoft\Yii\DataView\GridView\Column\ActionButton;
use Yiisoft\Yii\DataView\GridView\Column\ActionColumn;
use Yiisoft\Yii\DataView\GridView\Column\DataColumn;
use Yiisoft\Yii\DataView\GridView\GridView;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var CategoryDataReader $dataReader
 */

$this->setTitle('Categories');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', urlName: 'diary/post/index'),
    new Breadcrumb('Manage', urlName: 'diary/manage/post/index'),
    new Breadcrumb('Categories'),
);
?>
<div class="d-flex justify-content-between align-items-center">
    <h1>Categories</h1>
    <?= Html::a(
        NoEncode::string('<i class="bi bi-plus-circle me-1"></i> Create category'),
        $urlGenerator->generate('diary/manage/category/create'),
        ['class' => 'btn btn-outline-primary btn-sm'],
    ) ?>
</div>
<?= GridView::widget()
    ->dataReader($dataReader)
    ->containerClass('mt-4')
    ->columns(
        new DataColumn(
            'name',
            header: 'Category',
            content: static function (Category $category): string {
                return Html::encode($category->name)
                    . '<br>'
                    . Html::small((string) $category->id, ['class' => 'text-muted']);
            },
            encodeContent: false,
            filter: true,
            filterFactory: new NameFilterFactory(),
        ),
        new DataColumn(
            'countPosts',
            header: 'Count Posts',
        ),
        new ActionColumn(
            before: '<div class="btn-group">',
            after: '</div>',
            buttons: [
                new ActionButton(
                    Html::i()->class('bi bi-eye'),
                    static fn(Category $category) => $urlGenerator->category($category->slug),
                    title: 'View',
                ),
                new ActionButton(
                    Html::i()->class('bi bi-pencil'),
                    static fn(Category $category) => $urlGenerator->categoryUpdate($category->id),
                    title: 'Edit',
                ),
                new ActionButton(
                    Html::i()->class('bi bi-x-lg'),
                    static fn(Category $category) => $urlGenerator->generate('diary/manage/category/delete', ['id' => $category->id]),
                    title: 'Delete',
                ),
            ],
        ),
    ) ?>
