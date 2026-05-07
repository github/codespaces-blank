<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Api\Post\List;

use App\Domain\Post\Post;
use App\Presentation\Api\ResponseFactory\Presenter\OffsetPaginatorPresenter;
use App\Presentation\Api\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Yiisoft\Data\Db\QueryDataReader;
use Yiisoft\Data\Paginator\OffsetPaginator;
use Yiisoft\Http\Status;

final readonly class Action
{
    public function __construct(
        private ResponseFactory $responseFactory,
        private UrlGenerator $urlGenerator,
    ) {}

    public function __invoke(Input $input): ResponseInterface
    {
        $postQuery = Post::publicQuery();
        if ($input->categoryId !== null) {
            $postQuery
                ->joinWith('categories')
                ->andWhere(['category.id' => $input->categoryId]);
        }
        $paginator = new OffsetPaginator(
            new QueryDataReader($postQuery),
        );

        if ($input->page !== 1 && $input->page > $paginator->getTotalPages()) {
            return $this->responseFactory->fail('Page not found.', httpCode: Status::NOT_FOUND);
        }
        $paginator = $paginator->withCurrentPage($input->page);

        return $this->responseFactory->success(
            $paginator,
            new OffsetPaginatorPresenter(
                new PostPresenter($this->urlGenerator),
            ),
        );
    }
}
