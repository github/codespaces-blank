<?php

declare(strict_types=1);

use App\Domain\Post\Post;
use App\Domain\Post\PostStatus;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use App\UseCase\Diary\Manage\Post\Listing\PostStatusBadge;
use App\UseCase\Diary\Manage\Post\Listing\TitleFilterFactory;
use Yiisoft\Data\Db\QueryDataReader;
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
 * @var QueryDataReader<array-key, Post> $dataReader
 */

$this->setTitle('Posts');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', urlName: 'diary/post/index'),
    new Breadcrumb('Manage'),
);
?>
<div class="d-flex justify-content-between align-items-center">
    <h1>Posts</h1>
    <div>
        <?= Html::a(
            NoEncode::string('<i class="bi bi-card-list me-1"></i> Categories'),
            $urlGenerator->generate('diary/manage/category/index'),
            ['class' => 'btn btn-outline-secondary btn-sm me-1'],
        ) ?>
        <?= Html::a(
            NoEncode::string('<i class="bi bi-file-earmark-plus me-1"></i> Create post'),
            $urlGenerator->generate('diary/manage/post/create'),
            ['class' => 'btn btn-outline-primary btn-sm'],
        ) ?>
    </div>
</div>
<?= GridView::widget()
    ->dataReader($dataReader)
    ->containerClass('mt-4')
    ->columns(
        new DataColumn(
            'title',
            header: 'Post',
            content: static function (Post $post): string {
                return Html::encode($post->title)
                    . '<br>'
                    . Html::small((string) $post->getId(), ['class' => 'text-muted']);
            },
            encodeContent: false,
            filter: true,
            filterFactory: new TitleFilterFactory(),
        ),
        new DataColumn(
            'status',
            content: static fn(Post $post) => PostStatusBadge::widget([$post->status]),
            filter: PostStatus::labelsByValue(),
        ),
        new DataColumn(
            'publicationDate',
            header: 'Publication Date',
            content: static function (Post $post): string {
                return $post->publication_date?->format('Y-m-d') ?? '<i class="text-muted">not set</i>';
            },
            encodeContent: false,
        ),
        new DataColumn(
            'categories',
            content: static function (Post $post): string {
                $names = array_map(
                    static fn($category) => Html::encode($category->name),
                    $post->getCategories(),
                );
                return implode(', ', $names);
            },
        ),
        new DataColumn(
            header: 'Info',
            content: static function (Post $post): string {
                return Html::encode($post->getCreatedByUser()->name)
                    . ' '
                    . Html::small($post->created_at->format('Y-m-d H:i:s'), ['class' => 'text-muted'])
                    . '<br>'
                    . Html::encode($post->getUpdatedByUser()->name)
                    . ' '
                    . Html::small($post->updated_at->format('Y-m-d H:i:s'), ['class' => 'text-muted']);
            },
            encodeContent: false,
        ),
        new ActionColumn(
            before: '<div class="btn-group">',
            after: '</div>',
            buttons: [
                new ActionButton(
                    Html::i()->class('bi bi-eye'),
                    static fn(Post $post) => $urlGenerator->post($post->slug),
                    title: 'View',
                ),
                new ActionButton(
                    Html::i()->class('bi bi-pencil'),
                    static fn(Post $post) => $urlGenerator->postUpdate($post->getId()),
                    title: 'Update',
                ),
                new ActionButton(
                    Html::i()->class('bi bi-x-lg'),
                    static fn(Post $post) => $urlGenerator->generate('diary/manage/post/delete', ['id' => $post->getId()]),
                    title: 'Delete',
                ),
            ],
        ),
    )
?>
