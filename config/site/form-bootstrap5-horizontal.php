<?php

declare(strict_types=1);

use Yiisoft\Form\Theme\ThemePath;
use Yiisoft\FormModel\ValidationRulesEnricher;

return array_merge(
    require ThemePath::BOOTSTRAP5_HORIZONTAL,
    [
        'template' => "{label}\n<div class=\"col-sm-9\">{input}\n{hint}\n{error}</div>",
        'labelClass' => 'col-sm-3 col-form-label',
        'enrichFromValidationRules' => true,
        'validationRulesEnricher' => new ValidationRulesEnricher(),
    ],
);
