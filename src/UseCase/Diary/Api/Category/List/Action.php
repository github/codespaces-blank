<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Api\Category\List;

use App\Presentation\Api\ResponseFactory\Presenter\CollectionPresenter;
use App\Presentation\Api\ResponseFactory\ResponseFactory;
use App\Shared\Read\PublicCategoriesWithCountPosts\PublicCategoriesWithCountPosts;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;

final readonly class Action
{
    public function __construct(
        private ResponseFactory $responseFactory,
        private PublicCategoriesWithCountPosts $categoryReader,
        private UrlGenerator $urlGenerator,
    ) {}

    public function __invoke(): ResponseInterface
    {
        return $this->responseFactory->success(
            $this->categoryReader->find(),
            new CollectionPresenter(
                new CategoryPresenter($this->urlGenerator),
            ),
        );
    }
}
