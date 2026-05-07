<?php

declare(strict_types=1);

namespace App\UseCase\Users\CreateAdmin;

use App\Domain\User\User;
use Symfony\Component\Console\Input\InputInterface;
use Yiisoft\Validator\Rule\Length;
use Yiisoft\Validator\Rule\Required;

final readonly class Model
{
    #[Required(message: 'Login cannot be blank.')]
    #[Length(max: User::MAX_LOGIN_LENGTH)]
    public string $login;

    #[Required]
    #[Length(min: User::MIN_PASSWORD_LENGTH, max: User::MAX_PASSWORD_LENGTH)]
    public string $password;

    public function __construct(InputInterface $input)
    {
        $this->login = $input->getArgument('login');
        $this->password = $input->getArgument('password');
    }
}
