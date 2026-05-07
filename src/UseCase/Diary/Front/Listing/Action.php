<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Front\Listing;

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
        private PublicCategoriesWithCountPosts $categoriesReader,
        private ResponseFactory $responseFactory,
        private UrlGenerator $urlGenerator,
    ) {}

    public function __invoke(
        #[RouteArgument('page')]
        int $page = 1,
    ): ResponseInterface {
        $paginator = new OffsetPaginator(
            new QueryDataReader(
                Post::publicQuery(),
            ),
        );

        if ($page !== 1
            && ($page < 1 || $page > $paginator->getTotalPages())
        ) {
            return $this->responseFactory->temporarilyRedirect(
                $this->urlGenerator->diary(),
            );
        }

        $paginator = $paginator->withCurrentPage($page);

        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            [
                'paginator' => $paginator,
                'categories' => $this->categoriesReader->find(),
            ],
        );
    }
}
