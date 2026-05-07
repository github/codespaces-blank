<?php

declare(strict_types=1);

namespace App\UseCase\Users\List;

use App\Presentation\Site\ResponseFactory\ResponseFactory;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final readonly class Action
{
    public function __construct(
        private ResponseFactory $responseFactory,
    ) {}

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        if ($request->hasHeader('Hx-Request')) {
            return $this->responseFactory->createHtmlResponse(UsersList::widget());
        }

        return $this->responseFactory->render(__DIR__ . '/template.php');
    }
}
