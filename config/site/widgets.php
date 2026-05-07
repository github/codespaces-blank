<?php

declare(strict_types=1);

use Yiisoft\Definitions\Reference;
use Yiisoft\Yii\DataView\GridView\GridView;
use Yiisoft\Yii\DataView\YiiRouter\UrlCreator;
use Yiisoft\Yii\DataView\YiiRouter\UrlParameterProvider;

return [
    GridView::class => [
        'urlParameterProvider()' => [
            Reference::to(UrlParameterProvider::class),
        ],
        'urlCreator()' => [
            Reference::to(UrlCreator::class),
        ],
        'ignoreMissingPage()' => [true],
    ],
];
