<?php

declare(strict_types=1);

namespace App\UseCase\Profile\UpdateProfile;

use App\Domain\User\User;
use Yiisoft\FormModel\FormModel;
use Yiisoft\Validator\Rule\Length;
use Yiisoft\Validator\Rule\Required;

final class Form extends FormModel
{
    #[Required]
    #[Length(max: User::MAX_NAME_LENGTH)]
    public string $name = '';

    public function __construct(User $user)
    {
        $this->name = $user->name;
    }
}
