<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Api\Post\List;

use Yiisoft\FormModel\Attribute\Safe;
use Yiisoft\Input\Http\AbstractInput;
use Yiisoft\Input\Http\Attribute\Data\FromQuery;
use Yiisoft\Validator\Rule\Integer;

#[FromQuery]
final class Input extends AbstractInput
{
    /** @var positive-int */
    #[Integer(min: 1)]
    public int $page = 1;

    #[Safe]
    public ?int $categoryId = null;
}
