<?php

declare(strict_types=1);

namespace App\UseCase\Users\Update;

use App\Domain\User\User;
use App\Presentation\Site\Access\Role;
use App\Presentation\Site\Identity\AuthenticatedUserProvider;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\Db\Connection\ConnectionInterface;
use Yiisoft\ErrorHandler\Exception\UserException;
use Yiisoft\FormModel\FormHydrator;
use Yiisoft\Rbac\ManagerInterface;
use Yiisoft\Router\HydratorAttribute\RouteArgument;

use function sprintf;

final readonly class Action
{
    public function __construct(
        private FormHydrator $formHydrator,
        private ContentNotices $contentNotices,
        private ResponseFactory $responseFactory,
        private UrlGenerator $urlGenerator,
        private AuthenticatedUserProvider $authenticatedUserProvider,
        private ManagerInterface $rbacManager,
        private ConnectionInterface $db,
    ) {}

    /**
     * @throws UserException
     */
    public function __invoke(
        #[RouteArgument('id')]
        int $userId,
        ServerRequestInterface $request,
    ): ResponseInterface {
        /** @var User $user */
        $user = User::query()->findByPk($userId) ?? throw new UserException('User not found.');

        /** @var \Yiisoft\Rbac\Role|null $currentYiiRole */
        $currentYiiRole = array_first($this->rbacManager->getRolesByUserId($userId));
        $currentRole = $currentYiiRole === null ? null : Role::from($currentYiiRole->getName());
        $form = new Form(
            $user,
            $currentRole,
            $this->authenticatedUserProvider->getId() === $user->getId(),
        );

        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->renderForm($form);
        }

        /**
         * @var Role $role
         */
        $role = $form->role;

        if ($form->isCurrentUser) {
            if ($form->status !== $user->status) {
                throw new UserException('Cannot change status for current user.');
            }
            if ($role !== $currentRole) {
                throw new UserException('Cannot change role for current user.');
            }
        }

        if ($user->login !== $form->login
            && User::query()->where(['login' => $form->login])->exists()
        ) {
            $form->addError(
                sprintf('User with login "%s" already exist.', $form->login),
                valuePath: ['login'],
            );
            return $this->renderForm($form);
        }

        $user->login = $form->login;
        $user->name = $form->name;
        $user->status = $form->status;
        $this->db->transaction(
            function () use ($user, $role) {
                $user->save();
                $this->rbacManager->revokeAll($user->getId());
                $this->rbacManager->assign($role->value, $user->getId());
            },
        );

        $this->contentNotices->success(
            sprintf(
                'User "%s" is updated.',
                $form->login,
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
