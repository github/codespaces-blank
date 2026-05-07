<?php

declare(strict_types=1);

namespace App\Domain\Post;

use App\Domain\Category\Category;
use App\Domain\User\User;
use DateTimeImmutable;
use LogicException;
use Yiisoft\ActiveRecord\ActiveQueryInterface;
use Yiisoft\ActiveRecord\ActiveRecord;
use Yiisoft\Db\Expression\Expression;

/**
 * @psalm-suppress MissingConstructor
 */
final class Post extends ActiveRecord
{
    public const int MAX_TITLE_LENGTH = 255;
    public const int MAX_SLUG_LENGTH = 255;

    protected ?int $id = null;
    public PostStatus $status = PostStatus::Draft;
    public string $title;
    public string $body;
    public string $slug;
    public ?DateTimeImmutable $publication_date = null;
    public DateTimeImmutable $created_at;
    public int $created_by;
    public DateTimeImmutable $updated_at;
    public int $updated_by;

    public function getId(): int
    {
        return $this->id ?? throw new LogicException('ID is not set.');
    }

    /**
     * @return Category[]
     */
    public function getCategories(): array
    {
        /** @var Category[] */
        return $this->relationQuery('categories')->all();
    }

    public function getCreatedByUser(): User
    {
        /** @var User */
        return $this->relation('createdBy');
    }

    public function getUpdatedByUser(): User
    {
        /** @var User */
        return $this->relation('updatedBy');
    }

    public function tableName(): string
    {
        return '{{%post}}';
    }

    public static function publicQuery(): ActiveQueryInterface
    {
        return self::query()
            ->where(['status' => PostStatus::Published])
            ->andWhere(['<=', 'publication_date', new Expression('CURRENT_TIMESTAMP')])
            ->orderBy(['publication_date' => SORT_DESC]);
    }

    public function relationQuery(string $name): ActiveQueryInterface
    {
        return match ($name) {
            'categories' => $this
                ->hasMany(Category::class, ['id' => 'category_id'])
                ->viaTable('post_category', ['post_id' => 'id']),
            'createdBy' => $this->hasOne(User::class, ['id' => 'created_by']),
            'updatedBy' => $this->hasOne(User::class, ['id' => 'updated_by']),
            default => parent::relationQuery($name),
        };
    }

    protected function populateProperty(string $name, mixed $value): void
    {
        switch ($name) {
            case 'status':
                $this->status = PostStatus::from((int) $value);
                break;

            default:
                parent::populateProperty($name, $value);
        }
    }
}
