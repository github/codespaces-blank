<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\ContentNotices;

use Yiisoft\Session\Flash\FlashInterface;

use function is_array;
use function is_int;
use function is_string;

final readonly class ContentNotices
{
    private const string KEY = 'content-notices';

    public function __construct(
        private FlashInterface $flash,
    ) {}

    public function success(string $message): void
    {
        $this->flash->add(self::KEY, [Type::Success->value, $message]);
    }

    public function error(string $message): void
    {
        $this->flash->add(self::KEY, [Type::Error->value, $message]);
    }

    /**
     * @return list<Notice>
     */
    public function get(): array
    {
        $rows = $this->flash->get(self::KEY);
        if (!is_array($rows)) {
            return [];
        }

        $notices = [];
        foreach ($rows as $row) {
            if (
                !is_array($row)
                || array_keys($row) !== [0, 1]
                || !is_int($row[0])
                || !is_string($row[1])
                || $row[1] === ''
                || ($type = Type::tryFrom($row[0])) === null
            ) {
                continue;
            }
            $notices[] = new Notice($type, $row[1]);
        }

        return $notices;
    }
}
