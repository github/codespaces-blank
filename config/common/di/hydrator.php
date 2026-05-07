<?php

declare(strict_types=1);

use Yiisoft\Hydrator\TypeCaster\CompositeTypeCaster;
use Yiisoft\Hydrator\TypeCaster\HydratorTypeCaster;
use Yiisoft\Hydrator\TypeCaster\PhpNativeTypeCaster;
use Yiisoft\Hydrator\TypeCaster\TypeCasterInterface;

return [
    TypeCasterInterface::class => static fn() => new CompositeTypeCaster(
        new PhpNativeTypeCaster(),
        new HydratorTypeCaster(),
    ),
];
