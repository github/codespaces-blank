<?php

declare(strict_types=1);

namespace App\UseCase\Users\List\DataReader;

use App\Domain\User\UserStatus;
use App\Presentation\Site\Access\Role;
use Yiisoft\Data\Db\QueryDataReader;
use Yiisoft\Data\Reader\Sort;
use Yiisoft\Db\Connection\ConnectionInterface;
use Yiisoft\Rbac\ManagerInterface;
use Yiisoft\Rbac\Role as RbacRole;

/**
 * @extends QueryDataReader<array-key, User>
 */
final class UserDataReader extends QueryDataReader
{
    public function __construct(
        ConnectionInterface $db,
        ManagerInterface $rbacManager,
    ) {
        parent::__construct(
            $db->createQuery()
                ->select(['id', 'login', 'name', 'status'])
                ->from('user')
                ->resultCallback(
                    static function (array $rows) use ($rbacManager): array {
                        /**
                         * @var non-empty-list<array{
                         *      id: string,
                         *      login: non-empty-string,
                         *      name: non-empty-string,
                         *      status: string,
                         *  }> $rows
                         * @var list<string> $userIds
                         */
                        return array_map(
                            static function (array $row) use ($rbacManager) {
                                $userId = (int) $row['id'];
                                $roles = array_map(
                                    static fn(RbacRole $rbacRole) => Role::from($rbacRole->getName()),
                                    $rbacManager->getRolesByUserId($userId),
                                );
                                return new User(
                                    id: $userId,
                                    login: $row['login'],
                                    name: $row['name'],
                                    status: UserStatus::from((int) $row['status']),
                                    roles: $roles,
                                );
                            },
                            $rows,
                        );
                    },
                ),
            Sort::only(['id', 'login', 'name', 'status'])->withOrder(['id' => 'desc']),
        );
    }
}
