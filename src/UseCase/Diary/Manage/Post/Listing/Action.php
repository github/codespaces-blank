<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Post\Listing;

use App\Domain\Post\Post;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use Psr\Http\Message\ResponseInterface;
use Yiisoft\Data\Db\QueryDataReader;

final readonly class Action
{
    public function __construct(
        private ResponseFactory $responseFactory,
    ) {}

    public function __invoke(): ResponseInterface
    {
        $dataReader = new QueryDataReader(
            Post::query(),
        );

        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            [
                'dataReader' => $dataReader,
            ],
        );
    }
}
