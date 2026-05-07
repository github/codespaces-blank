<?php

declare(strict_types=1);

namespace App\Presentation\Site\Layout\ContentNotices;

use Yiisoft\Html\Html;
use Yiisoft\Html\NoEncode;
use Yiisoft\Widget\Widget;

final class ContentNoticesWidget extends Widget
{
    public function __construct(
        private readonly ContentNotices $contentNotices,
    ) {}

    public function render(): string
    {
        $notices = $this->contentNotices->get();
        if ($notices === []) {
            return '';
        }

        $html = [];
        foreach ($notices as $notice) {
            $html[] = Html::div()
                ->class('alert alert-dismissible fade show', $notice->type->class())
                ->content(
                    NoEncode::string(
                        '<button type="button" class="btn-close" data-bs-dismiss="alert" title="Close"></button>',
                    ),
                    $notice->message,
                );
        }

        return '<div class="container-fluid">' . implode('', $html) . '</div>';
    }
}
