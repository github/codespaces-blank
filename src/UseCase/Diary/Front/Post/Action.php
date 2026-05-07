<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Front\Post;

use App\Domain\Post\Post;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use Psr\Http\Message\ResponseInterface;
use Yiisoft\Router\HydratorAttribute\RouteArgument;

final readonly class Action
{
    public function __construct(
        private ResponseFactory $responseFactory,
    ) {}

    public function __invoke(
        #[RouteArgument('slug')]
        string $slug,
    ): ResponseInterface {
        /** @var Post|null $post */
        $post = Post::publicQuery()->andWhere(['slug' => $slug])->one();
        if ($post === null) {
            return $this->responseFactory->notFound();
        }

        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            [
                'post' => $post,
            ],
        );
    }
}
