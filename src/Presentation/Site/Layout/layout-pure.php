<?php

declare(strict_types=1);

use App\Presentation\Site\Layout\MainAsset;
use Yiisoft\Assets\AssetManager;
use Yiisoft\Html\Html;
use Yiisoft\View\WebView;

/**
 * @var WebView $this
 * @var AssetManager $assetManager
 * @var string $content
 */

$assetManager->register(MainAsset::class);

$this->addCssFiles($assetManager->getCssFiles());
$this->addCssStrings($assetManager->getCssStrings());
$this->addJsFiles($assetManager->getJsFiles());
$this->addJsStrings($assetManager->getJsStrings());
$this->addJsVars($assetManager->getJsVars());

$htmlAttributes = ['class' => $this->getParameter('htmlClass', null)];
$bodyAttributes = ['class' => $this->getParameter('bodyClass', null)];

$this->beginPage();
?>
<!DOCTYPE html>
<?= Html::openTag('html', $htmlAttributes) ?>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::title($this->getTitle()) ?>
    <?php $this->head() ?>
</head>
<?= Html::openTag('body', $bodyAttributes) ?>
<?php $this->beginBody() ?>
<?= $content ?>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
