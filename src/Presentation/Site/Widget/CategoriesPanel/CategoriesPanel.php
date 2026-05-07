<?php

declare(strict_types=1);

namespace App\Presentation\Site\Widget\CategoriesPanel;

use App\Shared\Read\PublicCategoriesWithCountPosts\Category;
use Yiisoft\View\WebView;
use Yiisoft\Widget\Widget;

final class CategoriesPanel extends Widget
{
    public function __construct(
        /** @var list<Category> */
        private readonly array $categories,
        private readonly ?int $currentCategoryId,
        private readonly WebView $view,
    ) {}

    /**
     * @param list<Category> $categories
     */
    public static function create(array $categories, ?int $currentCategoryId = null): self
    {
        return self::widget([$categories, $currentCategoryId]);
    }


    public function render(): string
    {
        if (empty($this->categories)) {
            return '';
        }

        return $this->view->render(
            __DIR__ . '/template.php',
            [
                'categories' => $this->categories,
                'currentCategoryId' => $this->currentCategoryId,
            ],
        );
    }
}
