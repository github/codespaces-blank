<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Category\Listing;

use Ramsey\Uuid\Uuid;
use Yiisoft\Data\Reader\Filter\Equals;
use Yiisoft\Data\Reader\Filter\Like;
use Yiisoft\Data\Reader\FilterInterface;
use Yiisoft\Yii\DataView\Filter\Factory\FilterFactoryInterface;

final readonly class NameFilterFactory implements FilterFactoryInterface
{
    public function create(string $property, string $value): FilterInterface
    {
        return Uuid::isValid($value)
            ? new Equals('id', $value)
            : new Like('name', $value, caseSensitive: false);
    }
}
