<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Front\Category;

use App\Domain\Category\Category;
use App\Domain\Post\Post;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\Read\PublicCategoriesWithCountPosts\PublicCategoriesWithCountPosts;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Yiisoft\Data\Db\QueryDataReader;
use Yiisoft\Data\Paginator\OffsetPaginator;
use Yiisoft\Router\HydratorAttribute\RouteArgument;

final readonly class Action
{
    public function __construct(
        private ResponseFactory $responseFactory,
        private UrlGenerator $urlGenerator,
        private PublicCategoriesWithCountPosts $categoryReader,
    ) {}

    public function __invoke(
        #[RouteArgument('slug')]
        string $slug,
        #[RouteArgument('page')]
        int $page = 1,
    ): ResponseInterface {
        /** @var Category|null $category */
        $category = Category::query()->where(['slug' => $slug])->one();
        if ($category === null) {
            return $this->responseFactory->notFound();
        }

        $paginator = new OffsetPaginator(
            new QueryDataReader(
                Post::publicQuery()
                    ->joinWith('categories')
                    ->andWhere(['category.id' => $category->getId()]),
            ),
        );

        if ($page !== 1
            && ($page < 1 || $page > $paginator->getTotalPages())
        ) {
            return $this->responseFactory->temporarilyRedirect(
                $this->urlGenerator->category($category->slug),
            );
        }

        $paginator = $paginator->withCurrentPage($page);

        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            [
                'category' => $category,
                'paginator' => $paginator,
                'categories' => $this->categoryReader->find(),
            ],
        );
    }
}
