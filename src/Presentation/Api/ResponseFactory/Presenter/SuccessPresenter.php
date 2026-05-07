<?php

declare(strict_types=1);

namespace App\Presentation\Api\ResponseFactory\Presenter;

/**
 * @implements PresenterInterface<mixed>
 */
final readonly class SuccessPresenter implements PresenterInterface
{
    public function __construct(
        private PresenterInterface $presenter = new AsIsPresenter(),
    ) {}

    public function present(mixed $value): array
    {
        return [
            'status' => 'success',
            'data' => $this->presenter->present($value),
        ];
    }
}
