<?php

declare(strict_types=1);

namespace App\UseCase\Login;

use App\Domain\User\AuthKeyGenerator;
use App\Domain\User\User;
use App\Presentation\Site\Identity\UserIdentity;
use App\Presentation\Site\Layout\Layout;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\FormModel\FormHydrator;
use Yiisoft\Security\PasswordHasher;
use Yiisoft\User\CurrentUser;
use Yiisoft\User\Login\Cookie\CookieLogin;

final readonly class Action
{
    public function __construct(
        private ResponseFactory $responseFactory,
        private CurrentUser $currentUser,
        private UrlGenerator $urlGenerator,
        private FormHydrator $formHydrator,
        private AuthKeyGenerator $authKeyGenerator,
        private CookieLogin $cookieLogin,
        private PasswordHasher $passwordHasher,
    ) {}

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        if (!$this->currentUser->isGuest()) {
            return $this->responseFactory->temporarilyRedirect($this->urlGenerator->home());
        }

        $form = new Form();
        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->renderForm($form);
        }

        /** @var User|null $user */
        $user = User::query()->where(['login' => $form->login])->one();
        if ($user === null
            || !$user->canSignIn()
            || !$this->passwordHasher->validate($form->password, $user->password_hash)
        ) {
            $form->addError(Form::ERROR_MESSAGE);
            return $this->renderForm($form);
        }

        $user->auth_key = $this->authKeyGenerator->generate();
        $user->save();

        $identity = new UserIdentity($user, $this->authKeyGenerator);
        if (!$this->currentUser->login($identity)) {
            $form->addError('Sign in is failed.');
            return $this->renderForm($form);
        }

        $response = $this->responseFactory->createResponse();
        if ($form->rememberMe) {
            $response = $this->cookieLogin->addCookie($identity, $response);
        }
        return $this->responseFactory->temporarilyRedirect($this->urlGenerator->home(), $response);
    }

    private function renderForm(Form $form): ResponseInterface
    {
        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            ['form' => $form],
            Layout::PURE,
        );
    }
}
