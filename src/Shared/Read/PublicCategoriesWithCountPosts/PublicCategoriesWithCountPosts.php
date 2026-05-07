<?php

declare(strict_types=1);

namespace App\Shared\Read\PublicCategoriesWithCountPosts;

final readonly class PublicCategoriesWithCountPosts
{
    /**
     * @return Category[]
     */
    public function find(): array
    {
        /**
         * @var array<array{
         *     id: string,
         *     name: string,
         *     slug: string,
         *     post_count: string
         * }> $rows
         */
        $rows = \App\Domain\Category\Category::query()
            ->select([
                'category.id',
                'category.name',
                'category.slug',
                'COUNT(post.id) AS post_count',
            ])
            ->joinWith('posts', false)
            ->groupBy(['category.id', 'category.name', 'category.slug'])
            ->asArray()
            ->all();

        return array_map(
            static fn(array $row) => new Category(
                (int) $row['id'],
                $row['name'],
                $row['slug'],
                (int) $row['post_count'],
            ),
            $rows,
        );
    }
}
