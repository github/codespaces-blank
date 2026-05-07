<?php

declare(strict_types=1);

use Yiisoft\Form\Theme\ThemePath;
use Yiisoft\FormModel\ValidationRulesEnricher;

return array_merge(
    require ThemePath::BOOTSTRAP5_VERTICAL,
    [
        'enrichFromValidationRules' => true,
        'validationRulesEnricher' => new ValidationRulesEnricher(),
    ],
);
