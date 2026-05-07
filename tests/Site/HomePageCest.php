<?php

declare(strict_types=1);

namespace App\Tests\Site;

use App\Tests\Support\SiteTester;

final class HomePageCest
{
    public function base(SiteTester $I): void
    {
        $I->wantTo('home page works.');
        $I->amOnPage('/');
        $I->expectTo('see page home.');
        $I->see('Welcome to Yii3 Demo Diary');
    }
}
