<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Post\Update;

use App\Domain\Post\Post;
use App\Domain\Post\PostStatus;
use DateTimeImmutable;
use Yiisoft\FormModel\Attribute\Safe;
use Yiisoft\FormModel\FormModel;
use Yiisoft\Hydrator\Attribute\Parameter\ToArrayOfStrings;
use Yiisoft\Hydrator\Attribute\Parameter\ToDateTime;
use Yiisoft\Hydrator\Attribute\Parameter\Trim;
use Yiisoft\Validator\Label;
use Yiisoft\Validator\Result;
use Yiisoft\Validator\Rule\Callback;
use Yiisoft\Validator\Rule\Length;
use Yiisoft\Validator\Rule\Required;

use function sprintf;

final class Form extends FormModel
{
    #[Trim]
    #[Required]
    #[Length(max: Post::MAX_TITLE_LENGTH)]
    public string $title;

    #[Trim]
    #[Safe]
    public string $body;

    #[Trim]
    #[Length(max: Post::MAX_SLUG_LENGTH)]
    public string $slug;

    #[Safe]
    public PostStatus $status;

    #[Safe]
    #[ToDateTime(format: 'php:Y-m-d')]
    #[Callback(method: 'validatePublicationDate')]
    public ?DateTimeImmutable $publicationDate;

    /**
     * @var list<string>
     */
    #[Label('Categories')]
    #[ToArrayOfStrings]
    #[Safe]
    public array $categoryIds;

    public function __construct(
        public readonly Post $post,
        /** @var array<int, string> */
        public readonly array $categories,
    ) {
        $this->title = $this->post->title;
        $this->body = $this->post->body;
        $this->slug = $this->post->slug;
        $this->status = $this->post->status;
        $this->publicationDate = $this->post->publication_date;
        /** @var list<string> */
        $this->categoryIds = $this->post->relationQuery('categories')->select('id')->column();
    }

    public function validatePublicationDate(mixed $value): Result
    {
        if ($this->status === PostStatus::Published && $value === null) {
            return new Result()->addError(
                sprintf('Publication date is required when status is "%s".', PostStatus::Published->label()),
            );
        }
        return new Result();
    }
}
