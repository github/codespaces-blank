<?php

declare(strict_types=1);

namespace App\Presentation\Api\ResponseFactory;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final readonly class NotFoundMiddleware implements MiddlewareInterface
{
    public function __construct(
        private ResponseFactory $responseFactory,
    ) {}

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        return $this->responseFactory->notFound();
    }
}
