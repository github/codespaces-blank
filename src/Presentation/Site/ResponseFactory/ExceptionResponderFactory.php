<?php

declare(strict_types=1);

namespace App\Presentation\Site\ResponseFactory;

use App\Presentation\Site\Layout\Layout;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Throwable;
use Yiisoft\ErrorHandler\Exception\UserException;
use Yiisoft\ErrorHandler\Middleware\ExceptionResponder;
use Yiisoft\Http\Status;
use Yiisoft\Injector\Injector;

final readonly class ExceptionResponderFactory
{
    public function __construct(
        private ResponseFactoryInterface $psrResponseFactory,
        private ResponseFactory $siteResponseFactory,
        private Injector $injector,
    ) {}

    public function create(): ExceptionResponder
    {
        return new ExceptionResponder(
            [
                PageNotFoundException::class => $this->pageNotFound(...),
                Throwable::class => $this->throwable(...),
            ],
            $this->psrResponseFactory,
            $this->injector,
        );
    }

    private function pageNotFound(PageNotFoundException $exception): ResponseInterface
    {
        return $this->siteResponseFactory->notFound(
            $exception->title,
            $exception->description,
        );
    }

    private function throwable(Throwable $exception): ResponseInterface
    {
        if (UserException::isUserException($exception)) {
            return $this->siteResponseFactory
                ->render(
                    __DIR__ . '/user-exception.php',
                    ['message' => $exception->getMessage()],
                    Layout::ERROR,
                )
                ->withStatus(Status::OK);
        }
        throw $exception;
    }
}
