<?php

declare(strict_types=1);

namespace App\Tests\Site;

use App\Tests\Support\SiteTester;

final class NotFoundHandlerCest
{
    public function nonExistentPage(SiteTester $I): void
    {
        $I->wantTo('see 404 page.');
        $I->amOnPage('/non-existent-page');
        $I->canSeeResponseCodeIs(404);
        $I->see('Page not found');
    }

    public function returnHome(SiteTester $I): void
    {
        $I->wantTo('check "Go Back Home" link.');
        $I->amOnPage('/non-existent-page');
        $I->canSeeResponseCodeIs(404);
        $I->click('Go Back Home');
        $I->expectTo('see page home.');
        $I->see('Welcome to Yii3 Demo Diary');
    }
}
