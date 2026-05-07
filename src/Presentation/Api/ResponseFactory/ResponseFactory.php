<?php

declare(strict_types=1);

namespace App\Presentation\Api\ResponseFactory;

use App\Presentation\Api\ResponseFactory\Presenter\AsIsPresenter;
use App\Presentation\Api\ResponseFactory\Presenter\FailPresenter;
use App\Presentation\Api\ResponseFactory\Presenter\PresenterInterface;
use App\Presentation\Api\ResponseFactory\Presenter\SuccessPresenter;
use App\Presentation\Api\ResponseFactory\Presenter\ValidationResultPresenter;
use Psr\Http\Message\ResponseInterface;
use Yiisoft\DataResponse\ResponseFactory\DataResponseFactoryInterface;
use Yiisoft\Http\Status;
use Yiisoft\Validator\Result;

final readonly class ResponseFactory
{
    public function __construct(
        private DataResponseFactoryInterface $dataResponseFactory,
    ) {}

    public function success(
        array|object|null $data = null,
        PresenterInterface $presenter = new AsIsPresenter(),
    ): ResponseInterface {
        return $this->dataResponseFactory->createResponse(
            new SuccessPresenter($presenter)->present($data),
        );
    }

    public function fail(
        string $message,
        array|object|null $data = null,
        ?int $code = null,
        int $httpCode = Status::BAD_REQUEST,
        PresenterInterface $presenter = new AsIsPresenter(),
    ): ResponseInterface {
        return $this->dataResponseFactory
            ->createResponse(
                new FailPresenter($message, $code, $presenter)->present($data),
            )
            ->withStatus($httpCode);
    }

    public function notFound(string $message = 'Not found.'): ResponseInterface
    {
        return $this->fail($message, httpCode: Status::NOT_FOUND);
    }

    public function failValidation(Result $result): ResponseInterface
    {
        return $this->fail(
            'Validation failed.',
            $result,
            httpCode: Status::UNPROCESSABLE_ENTITY,
            presenter: new ValidationResultPresenter(),
        );
    }
}
