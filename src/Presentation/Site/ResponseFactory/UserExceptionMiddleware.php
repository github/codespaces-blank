<?php

declare(strict_types=1);

namespace App\Presentation\Site\ResponseFactory;

use App\Presentation\Site\Layout\Layout;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Throwable;
use Yiisoft\ErrorHandler\Exception\UserException;
use Yiisoft\Http\Status;

final readonly class UserExceptionMiddleware implements MiddlewareInterface
{
    public function __construct(
        private ResponseFactory $responseFactory,
    ) {}

    /**
     * @throws Throwable
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            return $handler->handle($request);
        } catch (Throwable $exception) {
            if (UserException::isUserException($exception)) {
                return $this->handleUserException($exception, $request);
            }
            throw $exception;
        }
    }

    public function handleUserException(Throwable $exception, ServerRequestInterface $request): ResponseInterface
    {
        return $this->responseFactory
            ->render(
                __DIR__ . '/user-exception.php',
                ['message' => $exception->getMessage()],
                Layout::ERROR,
            )
            ->withStatus(Status::OK);
    }
}
