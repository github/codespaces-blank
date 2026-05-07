<?php

declare(strict_types=1);

namespace App\UseCase\Users\ChangePassword;

use App\Domain\User\User;
use Yiisoft\FormModel\FormModel;
use Yiisoft\Validator\Label;
use Yiisoft\Validator\Rule\Length;
use Yiisoft\Validator\Rule\Required;

final class Form extends FormModel
{
    #[Label('New password')]
    #[Required]
    #[Length(
        min: User::MIN_PASSWORD_LENGTH,
        max: User::MAX_PASSWORD_LENGTH,
        skipOnEmpty: true,
    )]
    public string $password = '';

    public function __construct(
        public readonly User $user,
    ) {}
}
