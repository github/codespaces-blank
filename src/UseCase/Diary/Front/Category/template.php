<?php

declare(strict_types=1);

use App\Domain\Category\Category as DomainCategory;
use App\Presentation\Site\Access\Permission;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Presentation\Site\Widget\CategoriesPanel\CategoriesPanel;
use App\Presentation\Site\Widget\PostsList\PostsList;
use App\Shared\Formatter;
use App\Shared\Read\PublicCategoriesWithCountPosts\Category;
use App\Shared\UrlGenerator;
use Yiisoft\Data\Paginator\OffsetPaginator;
use Yiisoft\Html\Html;
use Yiisoft\Html\NoEncode;
use Yiisoft\User\CurrentUser;
use Yiisoft\View\WebView;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var CurrentUser $currentUser
 * @var Formatter $formatter
 * @var DomainCategory $category
 * @var OffsetPaginator $paginator
 * @var list<Category> $categories
 */

$this->setTitle($category->name . ' / Diary');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', urlName: 'diary/post/index'),
    new Breadcrumb(
        $category->name,
        urlName: $paginator->isOnFirstPage() ? null : 'diary/category/index',
        urlParameters: ['slug' => $category->slug],
    ),
);
?>
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1><?= Html::encode($category->name) ?></h1>
    <?php if ($currentUser->can(Permission::DiaryManage)): ?>
        <div>
            <?= Html::a(
                NoEncode::string('<i class="bi bi-pencil me-1"></i> Edit'),
                $urlGenerator->categoryUpdate($category->getId()),
                ['class' => 'btn btn-outline-primary btn-sm'],
            ) ?>
        </div>
    <?php endif; ?>
</div>
<?php if ($category->desc !== '') { ?>
    <div class="mb-4">
        <p class="text-secondary mb-0">
            <?= nl2br(Html::encode($category->desc)) ?>
        </p>
    </div>
<?php } ?>
<div class="mb-5">
    <?= PostsList::widget([$paginator]) ?>
</div>
<?= CategoriesPanel::create($categories, $category->getId()) ?>
