<?php

declare(strict_types=1);

namespace App\UseCase\Profile\ChangePassword;

use App\Domain\User\User;
use App\Presentation\Site\Identity\AuthenticatedUserProvider;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\FormModel\FormHydrator;
use Yiisoft\Security\PasswordHasher;

final readonly class Action
{
    public function __construct(
        private AuthenticatedUserProvider $authenticatedUserProvider,
        private PasswordHasher $passwordHasher,
        private ResponseFactory $responseFactory,
        private FormHydrator $formHydrator,
        private UrlGenerator $urlGenerator,
        private ContentNotices $contentNotices,
    ) {}

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        /** @var User $user */
        $user = User::query()->findByPk(
            $this->authenticatedUserProvider->getId(),
        );

        $form = new Form($user, $this->passwordHasher);
        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->responseFactory->render(
                __DIR__ . '/template.php',
                ['form' => $form],
            );
        }

        $user->password_hash = $this->passwordHasher->hash($form->new);
        $user->save();

        $this->contentNotices->success('Password changed successfully.');
        return $this->responseFactory->temporarilyRedirect(
            $this->urlGenerator->profileChangePassword(),
        );
    }
}
