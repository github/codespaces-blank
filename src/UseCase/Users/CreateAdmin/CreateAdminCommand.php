<?php

declare(strict_types=1);

namespace App\UseCase\Users\CreateAdmin;

use App\Domain\User\AuthKeyGenerator;
use App\Domain\User\User;
use App\Presentation\Site\Access\Role;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Yiisoft\Db\Connection\ConnectionInterface;
use Yiisoft\Rbac\ManagerInterface;
use Yiisoft\Security\PasswordHasher;
use Yiisoft\Validator\ValidatorInterface;
use Yiisoft\Yii\Console\ExitCode;

#[AsCommand(
    name: 'user:create-admin',
    description: 'Create a new administrator',
)]
final class CreateAdminCommand extends Command
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly PasswordHasher $passwordHasher,
        private readonly AuthKeyGenerator $authKeyGenerator,
        private readonly ConnectionInterface $db,
        private readonly ManagerInterface $rbacManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('login', InputArgument::REQUIRED)
            ->addArgument('password', InputArgument::REQUIRED);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $model = new Model($input);

        $errors = $this->validator->validate($model)->getErrorMessages();
        if (!empty($errors)) {
            foreach ($errors as $message) {
                $io->error($message);
            }
            return ExitCode::DATAERR;
        }

        if (User::query()->where(['login' => $model->login])->exists()) {
            $io->error('Login "' . $model->login . '" already exists.');
            return ExitCode::DATAERR;
        }

        $user = new User();
        $user->name = $model->login;
        $user->login = $model->login;
        $user->password_hash = $this->passwordHasher->hash($model->password);
        $user->auth_key = $this->authKeyGenerator->generate();

        $this->db->transaction(
            function () use ($user) {
                $user->save();
                $this->rbacManager->assign(Role::Admin->value, $user->getId());
            },
        );
        $user->save();

        $io->success('Created user "' . $user->getId() . '".');
        return ExitCode::OK;
    }
}
