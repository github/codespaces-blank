<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Post\Delete;

use App\Domain\Post\Post;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\ErrorHandler\Exception\UserException;
use Yiisoft\Http\Method;
use Yiisoft\Router\HydratorAttribute\RouteArgument;

use function sprintf;

final readonly class Action
{
    public function __construct(
        private ContentNotices $contentNotices,
        private ResponseFactory $responseFactory,
        private UrlGenerator $urlGenerator,
    ) {}

    public function __invoke(
        #[RouteArgument('id')]
        int $postId,
        ServerRequestInterface $request,
    ): ResponseInterface {
        /** @var Post $post */
        $post = Post::query()->findByPk($postId) ?? throw new UserException('Post not found.');

        if ($request->getMethod() !== Method::POST) {
            return $this->responseFactory->render(
                __DIR__ . '/template.php',
                ['post' => $post],
            );
        }

        $post->unlinkAll('categories', true);
        $post->delete();

        $this->contentNotices->success(
            sprintf(
                'Post "%s" with ID "%s" is deleted.',
                $post->title,
                $post->getId(),
            ),
        );
        return $this->responseFactory->temporarilyRedirect($this->urlGenerator->generate('diary/manage/post/index'));
    }
}
