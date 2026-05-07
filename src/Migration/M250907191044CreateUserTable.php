<?php

declare(strict_types=1);

namespace App\Migration;

use Yiisoft\Db\Migration\MigrationBuilder;
use Yiisoft\Db\Migration\RevertibleMigrationInterface;

final class M250907191044CreateUserTable implements RevertibleMigrationInterface
{
    public function up(MigrationBuilder $b): void
    {
        $cb = $b->columnBuilder();
        $b->createTable('user', [
            'id' => $cb::primaryKey(),
            'login' => $cb::string(50)->notNull()->unique(),
            'name' => $cb::string(100)->notNull(),
            'status' => $cb::tinyint()->notNull(),
            'password_hash' => $cb::string()->notNull(),
            'auth_key' => $cb::string(75)->notNull(),
        ]);
    }

    public function down(MigrationBuilder $b): void
    {
        $b->dropTable('user');
    }
}
