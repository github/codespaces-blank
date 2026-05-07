<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Api\Post\List;

use App\Domain\Post\Post;
use App\Presentation\Api\ResponseFactory\Presenter\PresenterInterface;
use App\Shared\UrlGenerator;
use DateTimeImmutable;

/**
 * @implements PresenterInterface<Post>
 */
final readonly class PostPresenter implements PresenterInterface
{
    public function __construct(
        private UrlGenerator $urlGenerator,
    ) {}

    public function present(mixed $value): array
    {
        /** @var DateTimeImmutable $publicationDate */
        $publicationDate = $value->publication_date;

        return [
            'id' => $value->getId(),
            'title' => $value->title,
            'url' => $this->urlGenerator->post($value->slug, absolute: true),
            'body' => $value->body,
            'publicationDate' => $publicationDate->format('Y-m-d'),
            'categories' => array_map(
                static fn($category) => $category->getId(),
                $value->getCategories(),
            ),
        ];
    }
}
