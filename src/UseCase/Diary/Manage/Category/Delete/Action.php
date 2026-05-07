<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Category\Delete;

use App\Domain\Category\Category;
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
        int $categoryId,
        ServerRequestInterface $request,
    ): ResponseInterface {
        /** @var Category $category */
        $category = Category::query()->findByPk($categoryId) ?? throw new UserException('Category not found.');

        if ($request->getMethod() !== Method::POST) {
            return $this->responseFactory->render(
                __DIR__ . '/template.php',
                ['category' => $category],
            );
        }

        $category->unlinkAll('posts', true);
        $category->delete();

        $this->contentNotices->success(
            sprintf(
                'Category "%s" with ID "%s" is deleted.',
                $category->name,
                $category->getId(),
            ),
        );
        return $this->responseFactory->temporarilyRedirect($this->urlGenerator->generate('diary/manage/category/index'));
    }
}
