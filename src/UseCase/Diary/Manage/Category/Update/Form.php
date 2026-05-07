<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Category\Update;

use App\Domain\Category\Category;
use Yiisoft\FormModel\Attribute\Safe;
use Yiisoft\FormModel\FormModel;
use Yiisoft\Hydrator\Attribute\Parameter\Trim;
use Yiisoft\Validator\Rule\Length;
use Yiisoft\Validator\Rule\Required;

final class Form extends FormModel
{
    #[Trim]
    #[Required]
    #[Length(max: Category::MAX_NAME_LENGTH)]
    public string $name;

    #[Trim]
    #[Safe]
    public string $description;

    #[Trim]
    #[Length(max: Category::MAX_SLUG_LENGTH)]
    public string $slug;

    public function __construct(
        public readonly Category $category,
    ) {
        $this->name = $this->category->name;
        $this->description = $this->category->desc;
        $this->slug = $this->category->slug;
    }
}
