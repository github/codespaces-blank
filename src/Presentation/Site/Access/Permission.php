<?php

declare(strict_types=1);

namespace App\Presentation\Site\Access;

enum Permission: string
{
    case UserManage = 'user.manage';
    case DiaryManage = 'diary.manage';
}
