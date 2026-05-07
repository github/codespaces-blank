<?php

declare(strict_types=1);

namespace App\Presentation\Api\ResponseFactory\Presenter;

use Yiisoft\Data\Paginator\OffsetPaginator;

/**
 * @implements PresenterInterface<OffsetPaginator>
 */
final readonly class OffsetPaginatorPresenter implements PresenterInterface
{
    private CollectionPresenter $collectionPresenter;

    public function __construct(
        PresenterInterface $itemPresenter = new AsIsPresenter(),
    ) {
        $this->collectionPresenter = new CollectionPresenter($itemPresenter);
    }

    public function present(mixed $value): array
    {
        return [
            'items' => $this->collectionPresenter->present($value->read()),
            'page_size' => $value->getPageSize(),
            'current_page' => $value->getCurrentPage(),
            'total_pages' => $value->getTotalPages(),
        ];
    }
}
