<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\Breadcrumbs;

use App\Shared\UrlGenerator;
use Yiisoft\Html\Html;
use Yiisoft\Widget\Widget;

final class Breadcrumbs extends Widget
{
    /**
     * @param list<Breadcrumb> $breadcrumbs
     */
    public function __construct(
        private readonly UrlGenerator $urlGenerator,
        private readonly array $breadcrumbs,
    ) {}

    public function render(): string
    {
        $items = [];
        foreach ($this->breadcrumbs as $breadcrumb) {
            $items[] = [
                'label' => $breadcrumb->label,
                'url' => $this->generateUrl($breadcrumb),
            ];
        }

        if ($items === []) {
            return '';
        }

        array_unshift(
            $items,
            [
                'label' => 'Home',
                'url' => $this->urlGenerator->home(),
            ],
        );

        $html = '<nav class="container-fluid mt-2"><ol class="breadcrumb text-secondary fs-small">';
        foreach ($items as $item) {
            $html .= Html::li(
                $item['url'] === null
                    ? $item['label']
                    : Html::a($item['label'], $item['url'], ['class' => 'link-secondary']),
            )->class('breadcrumb-item');
        }
        $html .= '</ol></nav>';

        return $html;
    }

    private function generateUrl(Breadcrumb $breadcrumb): ?string
    {
        if ($breadcrumb->customUrl !== null) {
            return $breadcrumb->customUrl;
        }

        return $breadcrumb->urlName === null
            ? null
            : $this->urlGenerator->generate($breadcrumb->urlName, $breadcrumb->urlParameters);
    }
}
