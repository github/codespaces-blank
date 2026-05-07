<?php

declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\Post\Post;
use LogicException;
use Yiisoft\ActiveRecord\ActiveQueryInterface;
use Yiisoft\ActiveRecord\ActiveRecord;

/**
 * @psalm-suppress MissingConstructor
 */
final class User extends ActiveRecord
{
    public const int MIN_PASSWORD_LENGTH = 8;
    public const int MAX_PASSWORD_LENGTH = 96;
    public const int MAX_NAME_LENGTH = 100;
    public const int MAX_LOGIN_LENGTH = 50;

    protected ?int $id = null;
    public string $name;
    public string $login;
    public string $password_hash;
    public string $auth_key;
    public UserStatus $status = UserStatus::Active;

    public function getId(): int
    {
        return $this->id ?? throw new LogicException('ID is not set.');
    }

    public function canSignIn(): bool
    {
        return $this->status === UserStatus::Active;
    }

    public function tableName(): string
    {
        return '{{%user}}';
    }

    public function relationQuery(string $name): ActiveQueryInterface
    {
        return match ($name) {
            'postsCreatedBy' => $this->hasMany(Post::class, ['created_by' => 'id']),
            'postsUpdatedBy' => $this->hasMany(Post::class, ['updated_by' => 'id']),
            default => parent::relationQuery($name),
        };
    }

    protected function populateProperty(string $name, mixed $value): void
    {
        switch ($name) {
            case 'status':
                $this->status = UserStatus::from((int) $value);
                break;

            default:
                parent::populateProperty($name, $value);
        }
    }
}
