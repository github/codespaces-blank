<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Category\Listing;

use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\UseCase\Diary\Manage\Category\Listing\DataReader\CategoryDataReader;
use Psr\Http\Message\ResponseInterface;

final readonly class Action
{
    public function __construct(
        private CategoryDataReader $dataReader,
        private ResponseFactory $responseFactory,
    ) {}

    public function __invoke(): ResponseInterface
    {
        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            [
                'dataReader' => $this->dataReader,
            ],
        );
    }
}
