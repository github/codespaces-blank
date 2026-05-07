<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\Menu;

use Yiisoft\Html\Html;
use Yiisoft\Widget\Widget;

final class MainMenu extends Widget
{
    /**
     * @param list<Item> $items
     */
    public function __construct(
        private readonly ItemHandler $itemHandler,
        private readonly array $items,
    ) {}

    public function render(): string
    {
        $li = [];
        foreach ($this->items as $item) {
            $item = $this->itemHandler->handle($item);
            if ($item === null) {
                continue;
            }
            $li[] = Html::li(
                $item->url === null ? $item->label
                    : Html::a(
                        $item->label,
                        $item->url,
                        [
                            'class' => [
                                'nav-link px-2',
                                $item->active ? 'active' : 'link-secondary',
                            ],
                        ],
                    ),
            );
        }

        return (string) Html::ul()
            ->class('nav nav-pills col-12 col-md-auto mb-2 justify-content-center mb-md-0')
            ->items(...$li);
    }
}
