<?php

declare(strict_types=1);

namespace App\UseCase\Users\List;

use App\Shared\UrlGenerator;
use App\UseCase\Users\List\DataReader\User;
use App\UseCase\Users\List\DataReader\UserDataReader;
use Yiisoft\Data\Paginator\PaginatorInterface;
use Yiisoft\Html\Html;
use Yiisoft\Widget\Widget;
use Yiisoft\Yii\DataView\GridView\Column\ActionButton;
use Yiisoft\Yii\DataView\GridView\Column\ActionColumn;
use Yiisoft\Yii\DataView\GridView\Column\DataColumn;
use Yiisoft\Yii\DataView\GridView\GridView;
use Yiisoft\Yii\DataView\Pagination\OffsetPagination;
use Yiisoft\Yii\DataView\Pagination\PaginationWidgetInterface;

final class UsersList extends Widget
{
    public function __construct(
        private readonly UrlGenerator $urlGenerator,
        private readonly UserDataReader $userDataReader,
    ) {}

    public function render(): string
    {
        $htmxLoadAttributes = [
            'hx-indicator' => '#UsersGridView',
            'hx-target' => '#UsersGridView',
            'hx-replace-url' => 'true',
            'hx-swap' => 'outerHTML',
        ];

        /** @var PaginationWidgetInterface<PaginatorInterface> */
        $pagination = OffsetPagination::widget()->addLinkAttributes([
            'hx-boost' => 'true',
            ...$htmxLoadAttributes,
        ]);

        return GridView::widget()
            ->containerAttributes([
                'id' => 'UsersGridView',
                'class' => 'mt-4 position-relative',
            ])
            ->dataReader($this->userDataReader)
            ->sortableLinkAttributes([
                'hx-boost' => 'true',
                ...$htmxLoadAttributes,
            ])
            ->filterFormAttributes([
                'hx-boost' => 'true',
                ...$htmxLoadAttributes,
            ])
            ->paginationWidget($pagination)
            ->columns(
                new DataColumn(
                    'id',
                    header: 'ID',
                    filter: true,
                ),
                new DataColumn(
                    'login',
                    filter: true,
                ),
                new DataColumn(
                    'name',
                    filter: true,
                ),
                new DataColumn(
                    'status',
                    content: static fn(User $user) => $user->status->label(),
                ),
                new DataColumn(
                    'roles',
                    header: 'Role',
                    content: static fn(User $user) => implode(
                        ', ',
                        array_map(
                            static fn($role) => $role->label(),
                            $user->roles,
                        ),
                    ),
                ),
                new ActionColumn(
                    before: '<div class="btn-group">',
                    after: '</div>',
                    buttons: [
                        new ActionButton(
                            Html::i()->class('bi bi-pencil'),
                            fn(User $user) => $this->urlGenerator->generate('user/update', ['id' => $user->id]),
                            title: 'Update',
                        ),
                        new ActionButton(
                            Html::i()->class('bi bi-key'),
                            fn(User $user) => $this->urlGenerator->generate('user/change-password', ['id' => $user->id]),
                            title: 'Change password',
                        ),
                        new ActionButton(
                            Html::i()->class('bi bi-x-lg'),
                            fn(User $user) => $this->urlGenerator->generate('user/delete', ['id' => $user->id]),
                            title: 'Delete',
                        ),
                    ],
                ),
            )
            ->render();
    }
}
