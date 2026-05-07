<?php

declare(strict_types=1);

namespace App\Domain\Category;

use App\Domain\Post\Post;
use LogicException;
use Yiisoft\ActiveRecord\ActiveQueryInterface;
use Yiisoft\ActiveRecord\ActiveRecord;

/**
 * @psalm-suppress MissingConstructor
 */
final class Category extends ActiveRecord
{
    public const int MAX_NAME_LENGTH = 100;
    public const int MAX_SLUG_LENGTH = 100;

    protected ?int $id = null;
    public string $name;
    public string $desc;
    public string $slug;

    public function getId(): int
    {
        return $this->id ?? throw new LogicException('ID is not set.');
    }

    public function tableName(): string
    {
        return '{{%category}}';
    }

    public function relationQuery(string $name): ActiveQueryInterface
    {
        return match ($name) {
            'posts' => $this
                ->hasMany(Post::class, ['id' => 'post_id'])
                ->viaTable('post_category', ['category_id' => 'id']),
            default => parent::relationQuery($name),
        };
    }
}
