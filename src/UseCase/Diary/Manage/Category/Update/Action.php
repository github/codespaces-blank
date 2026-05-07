<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Category\Update;

use App\Domain\Category\Category;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Yiisoft\ErrorHandler\Exception\UserException;
use Yiisoft\FormModel\FormHydrator;
use Yiisoft\Router\HydratorAttribute\RouteArgument;
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

    public function __invoke(
        #[RouteArgument('id')]
        int $categoryId,
        ServerRequestInterface $request,
    ): ResponseInterface {
        /** @var Category $category */
        $category = Category::query()->findByPk($categoryId) ?? throw new UserException('Category not found.');

        $form = new Form($category);

        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->renderForm($form);
        }

        $slug = $form->slug;
        if ($slug === '') {
            $slug = mb_substr($this->inflector->toSlug($form->name), 0, Category::MAX_SLUG_LENGTH);
        }
        if (Category::query()->where(['slug' => $slug])->andWhere(['!=', 'id', $category->getId()])->exists()) {
            $form->getValidationResult()->addError(
                sprintf('Category with slug "%s" already exist.', $slug),
                valuePath: ['slug'],
            );
            return $this->renderForm($form);
        }

        $category->name = $form->name;
        $category->desc = $form->description;
        $category->slug = $slug;
        $category->save();

        $this->contentNotices->success(
            sprintf(
                'Category "%s" is updated.',
                $form->name,
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
