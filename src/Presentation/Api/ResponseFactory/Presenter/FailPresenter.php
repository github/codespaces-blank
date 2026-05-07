<?php

declare(strict_types=1);

namespace App\Presentation\Api\ResponseFactory\Presenter;

/**
 * @implements PresenterInterface<mixed>
 */
final readonly class FailPresenter implements PresenterInterface
{
    public function __construct(
        private string $message = 'Unknown error.',
        private ?int $code = null,
        private PresenterInterface $presenter = new AsIsPresenter(),
    ) {}

    public function present(mixed $value): mixed
    {
        $result = [
            'status' => 'failed',
            'error_message' => $this->message,
        ];
        if ($this->code !== null) {
            $result['error_code'] = $this->code;
        }
        if ($value !== null) {
            $result['error_data'] = $this->presenter->present($value);
        }
        return $result;
    }
}
