<?php

declare(strict_types=1);

namespace App\UseCase\Logout;

use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Yiisoft\User\CurrentUser;

final readonly class Action
{
    public function __invoke(
        CurrentUser $currentUser,
        ResponseFactory $responseFactory,
        UrlGenerator $urlGenerator,
    ): ResponseInterface {
        $currentUser->logout();
        return $responseFactory->temporarilyRedirect($urlGenerator->home());
    }
}
