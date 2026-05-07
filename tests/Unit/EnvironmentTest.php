<?php

declare(strict_types=1);

namespace App\Tests\Unit;

use App\Environment;
use Codeception\Test\Unit;

use function PHPUnit\Framework\assertSame;

final class EnvironmentTest extends Unit
{
    protected function _before(): void
    {
        Environment::prepare();
    }

    public function testAppEnv(): void
    {
        assertSame('test', Environment::appEnv());
    }
}
