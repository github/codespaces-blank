<?php

declare(strict_types=1);

namespace App\UseCase\Users\Update;

use App\Domain\User\User;
use App\Domain\User\UserStatus;
use App\Presentation\Site\Access\Role;
use Yiisoft\FormModel\Attribute\Safe;
use Yiisoft\FormModel\FormModel;
use Yiisoft\Validator\Rule\Length;
use Yiisoft\Validator\Rule\Required;

final class Form extends FormModel
{
    #[Required]
    #[Length(max: User::MAX_LOGIN_LENGTH)]
    public string $login;

    #[Required]
    #[Length(max: User::MAX_NAME_LENGTH)]
    public string $name;

    #[Safe]
    public UserStatus $status;

    public function __construct(
        public readonly User $user,
        #[Required]
        public ?Role $role,
        public readonly bool $isCurrentUser,
    ) {
        $this->login = $user->login;
        $this->name = $user->name;
        $this->status = $user->status;
    }
}
