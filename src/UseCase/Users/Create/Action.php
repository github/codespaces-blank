<?php

declare(strict_types=1);

namespace App\UseCase\Users\Create;

use App\Domain\User\AuthKeyGenerator;
use App\Domain\User\User;
use App\Presentation\Site\Access\Role;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\Db\Connection\ConnectionInterface;
use Yiisoft\FormModel\FormHydrator;
use Yiisoft\Rbac\ManagerInterface;
use Yiisoft\Security\PasswordHasher;

use function sprintf;

final readonly class Action
{
    public function __construct(
        private FormHydrator $formHydrator,
        private ContentNotices $contentNotices,
        private ResponseFactory $responseFactory,
        private UrlGenerator $urlGenerator,
        private PasswordHasher $passwordHasher,
        private AuthKeyGenerator $authKeyGenerator,
        private ConnectionInterface $db,
        private ManagerInterface $rbacManager,
    ) {}

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        $form = new Form();

        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->renderForm($form);
        }

        if (User::query()->where(['login' => $form->login])->exists()) {
            $form->getValidationResult()->addError('User with this login already exists.', valuePath: ['login']);
            return $this->renderForm($form);
        }

        /** @var Role $role */
        $role = $form->role;

        $user = new User();
        $user->login = $form->login;
        $user->name = $form->name;
        $user->password_hash = $this->passwordHasher->hash($form->password);
        $user->auth_key = $this->authKeyGenerator->generate();
        $this->db->transaction(
            function () use ($user, $role) {
                $user->save();
                $this->rbacManager->assign($role->value, $user->getId());
            },
        );

        $this->contentNotices->success(
            sprintf(
                'User "%s" with ID "%s" is created.',
                $form->login,
                $user->getId(),
            ),
        );
        return $this->responseFactory->temporarilyRedirect($this->urlGenerator->generate('user/index'));
    }

    private function renderForm(Form $form): ResponseInterface
    {
        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            ['form' => $form],
        );
    }
}
