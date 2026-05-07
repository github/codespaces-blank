<?php

declare(strict_types=1);

namespace App\Shared;

use DateTimeInterface;
use IntlDateFormatter;
use LogicException;

final readonly class Formatter
{
    public function asLongDate(DateTimeInterface $value): string
    {
        return $this->formatIntlDateFormatter(
            new IntlDateFormatter(null, IntlDateFormatter::LONG, IntlDateFormatter::NONE),
            $value,
        );
    }

    private function formatIntlDateFormatter(IntlDateFormatter $formatter, DateTimeInterface $value): string
    {
        $result = $formatter->format($value);
        if ($result === false) {
            throw new LogicException('Unexpected error on date formatting.');
        }
        return $result;
    }
}
