<?php

declare(strict_types=1);

use App\Domain\Post\Post;
use App\Presentation\Site\Access\Permission;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\Formatter;
use App\Shared\UrlGenerator;
use Yiisoft\Html\Html;
use Yiisoft\Html\NoEncode;
use Yiisoft\User\CurrentUser;
use Yiisoft\View\WebView;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var CurrentUser $currentUser
 * @var Formatter $formatter
 * @var Post $post
 */

$this->setTitle($post->title);
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', $urlGenerator->diary()),
    new Breadcrumb($post->title),
);
?>
<article>
    <header class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1><?= Html::encode($post->title) ?></h1>
            <?php if ($currentUser->can(Permission::DiaryManage)): ?>
                <div>
                    <?= Html::a(
                        NoEncode::string('<i class="bi bi-pencil me-1"></i> Edit'),
                        $urlGenerator->postUpdate($post->getId()),
                        ['class' => 'btn btn-outline-primary btn-sm'],
                    ) ?>
                </div>
            <?php endif; ?>
        </div>
        <div class="mb-3">
            <small class="text-uppercase text-muted fst-italic">
                <?php
                /** @psalm-suppress PossiblyNullArgument Public posts always contains date */
                echo $formatter->asLongDate($post->publication_date)
?>
            </small>
        </div>
        <?php
        $categories = $post->getCategories();
if ($categories !== []) {
    ?>
            <div class="mb-4">
                <?php foreach ($categories as $category) { ?>
                    <?= Html::a(
                        $category->name,
                        $urlGenerator->generate('diary/category/index', ['slug' => $category->slug]),
                        ['class' => 'badge fw-light bg-light text-dark border text-decoration-none link-primary link-opacity-75-hover me-2'],
                    ) ?>
                <?php } ?>
            </div>
        <?php } ?>
    </header>
    <?= nl2br(Html::encode($post->body)) ?>
</article>
