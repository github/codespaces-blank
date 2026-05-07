<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Category\Create;

use App\Domain\Category\Category;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\FormModel\FormHydrator;
use Yiisoft\Strings\Inflector;

use function sprintf;

final readonly class Action
{
    public function __construct(
        private FormHydrator $formHydrator,
        private ContentNotices $contentNotices,
        private ResponseFactory $responseFactory,
        private UrlGenerator $urlGenerator,
        private Inflector $inflector,
    ) {}

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        $form = new Form();

        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->renderForm($form);
        }

        $slug = $form->slug === ''
            ? mb_substr($this->inflector->toSlug($form->name), 0, Category::MAX_SLUG_LENGTH)
            : $form->slug;
        if (Category::query()->where(['slug' => $slug])->exists()) {
            $form->getValidationResult()->addError(
                sprintf('Category with slug "%s" already exist.', $slug),
                valuePath: ['slug'],
            );
            return $this->renderForm($form);
        }

        $category = new Category();
        $category->name = $form->name;
        $category->desc = $form->description;
        $category->slug = $slug;
        $category->save();

        $this->contentNotices->success(
            sprintf(
                'Category "%s" with ID "%s" is created.',
                $form->name,
                $category->getId(),
            ),
        );
        return $this->responseFactory->temporarilyRedirect($this->urlGenerator->generate('diary/manage/category/index'));
    }

    private function renderForm(Form $form): ResponseInterface
    {
        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            ['form' => $form],
        );
    }
}
