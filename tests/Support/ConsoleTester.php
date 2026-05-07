<?php

declare(strict_types=1);

namespace App\Tests\Support;

use function dirname;

/**
 * Inherited Methods
 * @method void wantTo($text)
 * @method void wantToTest($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void pause($vars = [])
 *
 * @SuppressWarnings(PHPMD)
 */
class ConsoleTester extends \Codeception\Actor
{
    use _generated\ConsoleTesterActions;

    /**
     * Define custom actions here
     */

    public function runApp(?string $parameters = null): void
    {
        $this->runShellCommand(
            dirname(__DIR__, 2) . '/yii' . ($parameters === null ? '' : (' ' . $parameters)),
        );
    }
}
