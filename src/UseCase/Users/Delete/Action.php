<?php

declare(strict_types=1);

namespace App\UseCase\Users\Delete;

use App\Domain\User\User;
use App\Presentation\Site\Identity\AuthenticatedUserProvider;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\ErrorHandler\Exception\UserException;
use Yiisoft\Http\Method;
use Yiisoft\Router\HydratorAttribute\RouteArgument;

use function sprintf;

final readonly class Action
{
    public function __construct(
        private AuthenticatedUserProvider $authenticatedUserProvider,
        private ContentNotices $contentNotices,
        private ResponseFactory $responseFactory,
        private UrlGenerator $urlGenerator,
    ) {}

    public function __invoke(
        #[RouteArgument('id')]
        int $userId,
        ServerRequestInterface $request,
    ): ResponseInterface {
        /** @var User $user */
        $user = User::query()->findByPk($userId) ?? throw new UserException('User not found.');

        if ($this->authenticatedUserProvider->getId() === $user->getId()) {
            throw new UserException('Cannot delete current user.');
        }

        if ($request->getMethod() !== Method::POST) {
            return $this->responseFactory->render(
                __DIR__ . '/template.php',
                ['user' => $user],
            );
        }

        if ($user->relationQuery('postsCreatedBy')->exists() || $user->relationQuery('postsUpdatedBy')->exists()) {
            throw new UserException('Cannot delete user with existing posts.');
        }
        $user->delete();

        $this->contentNotices->success(
            sprintf(
                'User "%s" with ID "%s" is deleted.',
                $user->login,
                $user->getId(),
            ),
        );
        return $this->responseFactory->temporarilyRedirect($this->urlGenerator->generate('user/index'));
    }
}
