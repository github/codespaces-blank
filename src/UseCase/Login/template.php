<?php

declare(strict_types=1);

use App\Presentation\Site\Layout\MainAsset;
use App\Shared\UrlGenerator;
use App\UseCase\Login\Form;
use Yiisoft\Assets\AssetManager;
use Yiisoft\Html\Html;
use Yiisoft\View\WebView;
use Yiisoft\Yii\View\Renderer\Csrf;

/**
 * @var WebView $this
 * @var Csrf $csrf
 * @var AssetManager $assetManager
 * @var UrlGenerator $urlGenerator
 * @var Form $form
 */

$this->setTitle('Login');
$this->addToParameter('htmlClass', 'h-100');
$this->addToParameter('bodyClass', 'd-flex h-100 align-items-center py-4 bg-body-tertiary');
?>
<main class="loginForm w-100 m-auto">
    <div class="loginForm_logo">
        <?= Html::a(
            Html::img($assetManager->getUrl(MainAsset::class, 'logo.svg'), 'Yii3 Demo Diary')->height(48),
            $urlGenerator->home(),
        ) ?>
    </div>
    <?= Html::form()
        ->post($urlGenerator->login())
        ->csrf($csrf)
        ->open() ?>
    <div class="form-floating">
        <?= Html::textInput('login', $form->login)->addAttributes([
            'id' => 'LoginFormInputLogin',
            'class' => 'form-control loginForm_login',
            'placeholder' => '',
            'required' => true,
        ]) ?>
        <label for="LoginFormInputLogin">Login</label>
    </div>
    <div class="form-floating">
        <?= Html::passwordInput('password')->addAttributes([
            'id' => 'LoginFormInputPassword',
            'class' => 'form-control loginForm_password',
            'placeholder' => '',
            'required' => true,
        ]) ?>
        <label for="LoginFormInputPassword">Password</label>
    </div>
    <div class="form-check text-start my-3">
        <?= Html::checkbox('rememberMe')
            ->class('form-check-input')
            ->id('LoginFormCheckboxRememberMe')
            ->checked($form->rememberMe) ?>
        <label class="form-check-label" for="LoginFormCheckboxRememberMe">
            Remember me
        </label>
    </div>
    <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
    <?php
    if ($form->isValidated() && !$form->isValid()) {
        echo Html::div(
            implode(
                '<br>',
                array_map(
                    Html::encode(...),
                    $form->getValidationResult()->getErrorMessages(),
                ),
            ),
            ['class' => 'text-bg-danger p-3 mt-4'],
        )->encode(false);
    }
?>
    <?= '</form>' ?>
</main>
