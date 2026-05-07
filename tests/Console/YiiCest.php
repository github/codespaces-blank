<?php

declare(strict_types=1);

namespace App\Tests\Console;

use App\Tests\Support\ConsoleTester;

final class YiiCest
{
    public function base(ConsoleTester $I): void
    {
        $I->runApp();
        $I->canSeeResultCodeIs(0);
        $I->seeInShellOutput('Yii Console');
    }
}
