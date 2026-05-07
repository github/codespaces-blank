<?php

declare(strict_types=1);

namespace App\Presentation\Api\ResponseFactory\Presenter;

use Yiisoft\Validator\Result;

/**
 * @implements PresenterInterface<Result>
 */
final readonly class ValidationResultPresenter implements PresenterInterface
{
    public function present(mixed $value): array
    {
        return $value->getErrorMessagesIndexedByPath();
    }
}
