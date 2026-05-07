<?php

declare(strict_types=1);

namespace App\Shared;

use Yiisoft\Router\UrlGeneratorInterface;

/**
 * @psalm-import-type UrlArgumentsType from UrlGeneratorInterface
 */
final readonly class UrlGenerator
{
    public function __construct(
        private UrlGeneratorInterface $generator,
    ) {}

    public function home(): string
    {
        return $this->generate('home');
    }

    public function login(): string
    {
        return $this->generate('login');
    }

    public function logout(): string
    {
        return $this->generate('logout');
    }

    public function profileChangePassword(): string
    {
        return $this->generate('profile/change-password');
    }

    public function profileUpdate(): string
    {
        return $this->generate('profile/update');
    }

    public function diary(int|string $page = 1): string
    {
        return $this->generate('diary/post/index', $page === 1 ? [] : ['page' => $page]);
    }

    public function category(string $slug, int|string $page = 1, bool $absolute = false): string
    {
        $arguments = [
            'slug' => $slug,
            ...($page === 1 ? [] : ['page' => $page]),
        ];
        return $absolute
            ? $this->generateAbsolute('diary/category/index', $arguments)
            : $this->generate('diary/category/index', $arguments);
    }

    public function categoryUpdate(int $id): string
    {
        return $this->generate('diary/manage/category/update', ['id' => $id]);
    }

    public function post(string $slug, bool $absolute = false): string
    {
        return $absolute
            ? $this->generateAbsolute('diary/post/view', ['slug' => $slug])
            : $this->generate('diary/post/view', ['slug' => $slug]);
    }

    public function postUpdate(int $id): string
    {
        return $this->generate('diary/manage/post/update', ['id' => $id]);
    }

    /**
     * @param UrlArgumentsType $arguments
     */
    public function generate(string $name, array $arguments = [], array $queryParameters = []): string
    {
        return $this->generator->generate($name, $arguments, $queryParameters);
    }

    /**
     * @param UrlArgumentsType $arguments
     */
    public function generateAbsolute(string $name, array $arguments = [], array $queryParameters = []): string
    {
        return $this->generator->generateAbsolute($name, $arguments, $queryParameters);
    }
}
