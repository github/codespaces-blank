<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Category\Listing\DataReader;

final readonly class Category
{
    public function __construct(
        public int $id,
        public string $name,
        public string $description,
        public string $slug,
        public int $countPosts,
    ) {}
}
