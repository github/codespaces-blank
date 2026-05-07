<?php

declare(strict_types=1);

namespace App\UseCase\Users\ChangePassword;

use App\Domain\User\User;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\ErrorHandler\Exception\UserException;
use Yiisoft\FormModel\FormHydrator;
use Yiisoft\Router\HydratorAttribute\RouteArgument;
use Yiisoft\Security\PasswordHasher;

use function sprintf;

final readonly class Action
{
    public function __construct(
        private ResponseFactory $responseFactory,
        private FormHydrator $formHydrator,
        private UrlGenerator $urlGenerator,
        private ContentNotices $contentNotices,
        private PasswordHasher $passwordHasher,
    ) {}

    public function __invoke(
        #[RouteArgument('id')]
        int $userId,
        ServerRequestInterface $request,
    ): ResponseInterface {
        /** @var User $user */
        $user = User::query()->findByPk($userId) ?? throw new UserException('User not found.');

        $form = new Form($user);
        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->responseFactory->render(
                __DIR__ . '/template.php',
                ['form' => $form],
            );
        }

        $user->password_hash = $this->passwordHasher->hash($form->password);
        $user->save();

        $this->contentNotices->success(sprintf('Password for user "%s" changed successfully.', $user->login));
        return $this->responseFactory->temporarilyRedirect(
            $this->urlGenerator->generate('user/index'),
        );
    }
}
