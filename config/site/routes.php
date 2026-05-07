<?php

declare(strict_types=1);

use App\Presentation\Site\Access\CheckAccess;
use App\Presentation\Site\Access\Permission;
use Yiisoft\Auth\Middleware\Authentication;
use Yiisoft\Router\Group;
use Yiisoft\Router\Route;

return [
    Route::get('/')->action(\App\UseCase\Home\Action::class)->name('home'),

    /**
     * Diary
     */
    Group::create()
        ->middleware(CheckAccess::definition(Permission::DiaryManage))
        ->routes(
            Route::get('/diary/manage')->action(\App\UseCase\Diary\Manage\Post\Listing\Action::class)->name('diary/manage/post/index'),
            Route::methods(['GET', 'POST'], '/diary/manage/post/create')->action(\App\UseCase\Diary\Manage\Post\Create\Action::class)->name('diary/manage/post/create'),
            Route::methods(['GET', 'POST'], '/diary/manage/post/update/{id}')->action(\App\UseCase\Diary\Manage\Post\Update\Action::class)->name('diary/manage/post/update'),
            Route::methods(['GET', 'POST'], '/diary/manage/post/delete/{id}')->action(\App\UseCase\Diary\Manage\Post\Delete\Action::class)->name('diary/manage/post/delete'),
            Route::get('/diary/manage/categories')->action(\App\UseCase\Diary\Manage\Category\Listing\Action::class)->name('diary/manage/category/index'),
            Route::methods(['GET', 'POST'], '/diary/manage/category/create')->action(\App\UseCase\Diary\Manage\Category\Create\Action::class)->name('diary/manage/category/create'),
            Route::methods(['GET', 'POST'], '/diary/manage/category/update/{id}')->action(\App\UseCase\Diary\Manage\Category\Update\Action::class)->name('diary/manage/category/update'),
            Route::methods(['GET', 'POST'], '/diary/manage/category/delete/{id}')->action(\App\UseCase\Diary\Manage\Category\Delete\Action::class)->name('diary/manage/category/delete'),
        ),
    Route::get('/diary/category/{slug}[/{page}]')->action(\App\UseCase\Diary\Front\Category\Action::class)->name('diary/category/index'),
    Route::get('/diary/post/{slug}')->action(\App\UseCase\Diary\Front\Post\Action::class)->name('diary/post/view'),
    Route::get('/diary[/{page}]')->action(\App\UseCase\Diary\Front\Listing\Action::class)->name('diary/post/index'),

    /**
     * Users
     */
    Group::create()
        ->middleware(CheckAccess::definition(Permission::UserManage))
        ->routes(
            Route::get('/users')->action(\App\UseCase\Users\List\Action::class)->name('user/index'),
            Route::methods(['GET', 'POST'], '/users/create')
                ->action(\App\UseCase\Users\Create\Action::class)
                ->name('user/create'),
            Route::methods(['GET', 'POST'], '/users/update/{id}')
                ->action(\App\UseCase\Users\Update\Action::class)
                ->name('user/update'),
            Route::methods(['GET', 'POST'], '/users/change-password/{id}')
                ->action(\App\UseCase\Users\ChangePassword\Action::class)
                ->name('user/change-password'),
            Route::methods(['GET', 'POST'], '/users/delete/{id}')
                ->action(\App\UseCase\Users\Delete\Action::class)
                ->name('user/delete'),
        ),

    /**
     * Current user
     */
    Route::methods(['GET', 'POST'], '/login')->action(\App\UseCase\Login\Action::class)->name('login'),
    Group::create()
        ->middleware(Authentication::class)
        ->routes(
            Route::post('/logout')->action(\App\UseCase\Logout\Action::class)->name('logout'),
            Route::methods(['GET', 'POST'], '/profile/change-password')
                ->action(\App\UseCase\Profile\ChangePassword\Action::class)
                ->name('profile/change-password'),
            Route::methods(['GET', 'POST'], '/profile/update')
                ->action(\App\UseCase\Profile\UpdateProfile\Action::class)
                ->name('profile/update'),
        ),
];
