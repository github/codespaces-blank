<?php

declare(strict_types=1);

namespace App\Presentation\Site\Widget\PostsList;

use App\Domain\Post\Post;
use Yiisoft\Data\Paginator\OffsetPaginator;
use Yiisoft\View\WebView;
use Yiisoft\Widget\Widget;

final class PostsList extends Widget
{
    public function __construct(
        private readonly OffsetPaginator $paginator,
        private readonly WebView $view,
    ) {}

    public function render(): string
    {
        /** @var Post[] $posts */
        $posts = [...$this->paginator->read()];

        return empty($posts)
            ? $this->view->render(__DIR__ . '/empty.php')
            : $this->view->render(
                __DIR__ . '/template.php',
                [
                    'posts' => $posts,
                    'paginator' => $this->paginator,
                ],
            );
    }
}
