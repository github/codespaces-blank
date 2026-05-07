<?php

declare(strict_types=1);

namespace App\Presentation\Site\Access;

use App\Presentation\Site\ResponseFactory\ResponseFactory;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Yiisoft\User\CurrentUser;

final readonly class CheckAccess implements MiddlewareInterface
{
    public function __construct(
        private CurrentUser $currentUser,
        private ResponseFactory $responseFactory,
        private string $permissionName,
        private array $params,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public static function definition(Permission $permission, array $params = []): array
    {
        return [
            'class' => self::class,
            '__construct()' => [
                'permissionName' => $permission->value,
                'params' => $params,
            ],
        ];
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if ($this->currentUser->can($this->permissionName, $this->params)) {
            return $handler->handle($request);
        }

        return $this->responseFactory->accessDenied();
    }
}
