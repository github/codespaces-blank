<?php

declare(strict_types=1);

namespace App\UseCase\Profile\ChangePassword;

use App\Domain\User\User;
use Yiisoft\FormModel\FormModel;
use Yiisoft\Security\PasswordHasher;
use Yiisoft\Validator\Label;
use Yiisoft\Validator\Result;
use Yiisoft\Validator\Rule\Callback;
use Yiisoft\Validator\Rule\CompareType;
use Yiisoft\Validator\Rule\Equal;
use Yiisoft\Validator\Rule\Length;
use Yiisoft\Validator\Rule\Required;

final class Form extends FormModel
{
    #[Label('Current password')]
    #[Required]
    #[Length(
        min: User::MIN_PASSWORD_LENGTH,
        max: User::MAX_PASSWORD_LENGTH,
        skipOnEmpty: true,
    )]
    #[Callback(method: 'checkCurrentPassword', skipOnError: true)]
    public string $current = '';

    #[Label('New password')]
    #[Required]
    #[Length(
        min: User::MIN_PASSWORD_LENGTH,
        max: User::MAX_PASSWORD_LENGTH,
        skipOnEmpty: true,
    )]
    public string $new = '';

    #[Label('Once again')]
    #[Required]
    #[Equal(targetProperty: 'new', type: CompareType::STRING)]
    public string $new2 = '';

    public function __construct(
        private readonly User $user,
        private readonly PasswordHasher $passwordHasher,
    ) {}

    /**
     * @psalm-suppress ArgumentTypeCoercion
     */
    public function checkCurrentPassword(string $value): Result
    {
        if ($this->passwordHasher->validate($value, $this->user->password_hash)) {
            return new Result();
        }
        return new Result()->addError('Invalid current password.');
    }
}
