<?php

declare(strict_types=1);

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
 * @var OffsetPaginator $paginator
 * @var list<Category> $categories
 */

$this->setTitle('Diary');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', urlName: $paginator->isOnFirstPage() ? null : 'diary/post/index'),
);
?>
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1>Diary</h1>
    <?php if ($currentUser->can(Permission::DiaryManage)): ?>
        <div>
            <?= Html::a(
                NoEncode::string('<i class="bi bi-card-list me-1"></i> Manage'),
                $urlGenerator->generate('diary/manage/post/index'),
                ['class' => 'btn btn-outline-secondary btn-sm'],
            ) ?>
        </div>
    <?php endif; ?>
</div>
<?= CategoriesPanel::create($categories) ?>
<div class="mb-4">
    <?= PostsList::widget([$paginator]) ?>
</div>
