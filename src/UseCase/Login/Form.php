<?php

declare(strict_types=1);

namespace App\UseCase\Login;

use App\Domain\User\User;
use Yiisoft\FormModel\Attribute\Safe;
use Yiisoft\FormModel\FormModel;
use Yiisoft\Hydrator\Attribute\Parameter\Trim;
use Yiisoft\Validator\Result;
use Yiisoft\Validator\Rule\Callback;
use Yiisoft\Validator\Rule\Required;

final class Form extends FormModel
{
    public const string ERROR_MESSAGE = 'Incorrect login or password.';

    #[Trim]
    #[Required]
    public string $login = '';

    #[Required]
    #[Callback(method: 'validateLoginAndPassword', skipOnError: true)]
    public string $password = '';

    #[Safe]
    public bool $rememberMe = false;

    private function validateLoginAndPassword(): Result
    {
        $result = new Result();
        if (mb_strlen($this->login) > User::MAX_LOGIN_LENGTH
            || mb_strlen($this->password) < User::MIN_PASSWORD_LENGTH
            || mb_strlen($this->password) > User::MAX_PASSWORD_LENGTH
        ) {
            $result->addError(self::ERROR_MESSAGE);
        }
        return $result;
    }

    public function getFormName(): string
    {
        return '';
    }
}
