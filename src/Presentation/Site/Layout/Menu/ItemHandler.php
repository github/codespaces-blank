<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\Menu;

use Yiisoft\Injector\Injector;
use Yiisoft\Router\CurrentRoute;
use Yiisoft\Router\UrlGeneratorInterface;
use Yiisoft\User\CurrentUser;

final readonly class ItemHandler
{
    public function __construct(
        private UrlGeneratorInterface $urlGenerator,
        private Injector $injector,
        private CurrentRoute $currentRoute,
        private CurrentUser $currentUser,
    ) {}

    public function handle(Item $item): ?HandledItem
    {
        if ($item->permission !== null && !$this->currentUser->can($item->permission)) {
            return null;
        }

        return new HandledItem(
            label: $item->label,
            url: $this->generateUrl($item),
            active: $this->shouldBeActive($item),
        );
    }

    private function generateUrl(Item $item): ?string
    {
        if ($item->customUrl !== null) {
            return $item->customUrl;
        }

        if ($item->urlName === null) {
            return null;
        }

        return $this->urlGenerator->generate($item->urlName, $item->urlParameters);
    }

    private function shouldBeActive(Item $item): bool
    {
        if ($item->activeCallback !== null) {
            return (bool) $this->injector->invoke($item->activeCallback);
        }

        return $item->urlName !== null
            && $this->currentRoute->getName() === $item->urlName;
    }
}
