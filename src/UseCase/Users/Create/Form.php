<?php

declare(strict_types=1);

namespace App\UseCase\Users\Create;

use App\Domain\User\User;
use App\Presentation\Site\Access\Role;
use Yiisoft\FormModel\FormModel;
use Yiisoft\Validator\Rule\Length;
use Yiisoft\Validator\Rule\Required;

final class Form extends FormModel
{
    #[Required]
    #[Length(max: User::MAX_LOGIN_LENGTH)]
    public string $login = '';

    #[Required]
    #[Length(max: User::MAX_NAME_LENGTH)]
    public string $name = '';

    #[Required]
    #[Length(min: User::MIN_PASSWORD_LENGTH, max: User::MAX_PASSWORD_LENGTH)]
    public string $password = '';

    #[Required]
    public ?Role $role = null;
}
