<?php

declare(strict_types=1);

use App\Domain\Post\Post;
use App\Presentation\Site\Layout\Breadcrumbs\Breadcrumb;
use App\Shared\UrlGenerator;
use Yiisoft\Html\Html;
use Yiisoft\Strings\StringHelper;
use Yiisoft\View\WebView;
use Yiisoft\Yii\View\Renderer\Csrf;

/**
 * @var WebView $this
 * @var UrlGenerator $urlGenerator
 * @var Csrf $csrf
 * @var Post $post
 */

$this->setTitle('Delete post "' . $post->title . '"');
$this->addToParameter(
    'breadcrumbs',
    new Breadcrumb('Diary', urlName: 'diary/post/index'),
    new Breadcrumb('Manage', urlName: 'diary/manage/post/index'),
    new Breadcrumb('Delete post'),
);
?>
<h1>Delete post "<?= Html::encode($post->title) ?>"?</h1>
<div class="container-fluid mt-4">
    <div class="border rounded p-3 bg-light mb-3">
        <?= Html::encode(StringHelper::truncateBegin($post->body, 500)) ?>
    </div>
    <div class="mt-4">
        <?= Html::form()
            ->post($urlGenerator->generate('diary/manage/post/delete', ['id' => $post->getId()]))
            ->csrf($csrf)
            ->open() ?>
        <?= Html::submitButton('Delete', ['class' => 'btn btn-danger']) ?>
        <?= Html::a('Cancel', $urlGenerator->generate('diary/manage/post/index'), ['class' => 'btn btn-outline-secondary']) ?>
        <?= '</form>' ?>
    </div>
</div>
