<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Api\Category\List;

use App\Presentation\Api\ResponseFactory\Presenter\PresenterInterface;
use App\Shared\Read\PublicCategoriesWithCountPosts\Category;
use App\Shared\UrlGenerator;

/**
 * @implements PresenterInterface<Category>
 */
final readonly class CategoryPresenter implements PresenterInterface
{
    public function __construct(
        private UrlGenerator $urlGenerator,
    ) {}

    public function present(mixed $value): array
    {
        return [
            'id' => $value->id,
            'name' => $value->name,
            'url' => $this->urlGenerator->category($value->slug, absolute: true),
            'count_posts' => $value->countPosts,
        ];
    }
}
