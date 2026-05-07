<?php

declare(strict_types=1);

use App\Domain\Post\Post;
use App\Shared\Formatter;
use App\Shared\UrlGenerator;
use Yiisoft\Data\Paginator\OffsetPaginator;
use Yiisoft\Html\Html;
use Yiisoft\Strings\StringHelper;
use Yiisoft\View\WebView;
use Yiisoft\Yii\DataView\Pagination\OffsetPagination;
use Yiisoft\Yii\DataView\Pagination\PaginationContext;

/**
 * @var WebView $this
 * @var Formatter $formatter
 * @var UrlGenerator $urlGenerator
 * @var OffsetPaginator $paginator
 * @var Post[] $posts
 */
?>

<?php foreach ($posts as $post) { ?>
    <div class="card shadow-sm border-0 rounded-3 mb-4">
        <div class="card-body">
            <h5 class="h5 mb-2">
                <?= Html::a($post->title, $urlGenerator->post($post->slug), [
                    'class' => 'text-dark text-decoration-underline link-primary link-opacity-100-hover',
                ]) ?>
            </h5>
            <div class="mb-2">
                <small class="text-uppercase text-muted fst-italic">
                    <?php
                    /** @psalm-suppress PossiblyNullArgument Public posts always contains date */
                    echo $formatter->asLongDate($post->publication_date);
    ?>
                </small>
            </div>
            <p class="card-text text-secondary">
                <?= Html::encode(StringHelper::truncateBegin($post->body, 500)) ?>
            </p>
            <?php
            $categories = $post->getCategories();
    if ($categories !== []) {
        ?>
                <div class="mt-3">
                    <?php foreach ($categories as $category) { ?>
                        <?= Html::a(
                            $category->name,
                            $urlGenerator->category($category->slug),
                            [
                                'class' => 'badge fw-light bg-light text-dark border text-decoration-none link-primary link-opacity-75-hover',
                            ],
                        ) ?>
                    <?php } ?>
                </div>
            <?php } ?>
        </div>
    </div>
<?php } ?>
<?= OffsetPagination::create(
    $paginator,
    $urlGenerator->diary(PaginationContext::URL_PLACEHOLDER),
    $urlGenerator->diary(),
) ?>
