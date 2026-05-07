<?php

declare(strict_types=1);

use Yiisoft\Router\Route;

return [
    Route::get('/diary/category/list')->action(\App\UseCase\Diary\Api\Category\List\Action::class),
    Route::get('/diary/post/list')->action(\App\UseCase\Diary\Api\Post\List\Action::class),
];
