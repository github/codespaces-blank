<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Post\Update;

use App\Domain\Category\Category;
use App\Domain\Post\Post;
use App\Presentation\Site\Identity\AuthenticatedUserProvider;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use DateTimeImmutable;
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
        private AuthenticatedUserProvider $authenticatedUserProvider,
        private Inflector $inflector,
    ) {}

    public function __invoke(
        #[RouteArgument('id')]
        int $postId,
        ServerRequestInterface $request,
    ): ResponseInterface {
        /** @var Post $post */
        $post = Post::query()->findByPk($postId) ?? throw new UserException('Post not found.');

        /** @var array<int, string> $categories */
        $categories = Category::query()->select('name')->indexBy('id')->column();
        $form = new Form($post, $categories);

        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->renderForm($form);
        }

        $slug = $form->slug === ''
            ? mb_substr($this->inflector->toSlug($form->title), 0, Post::MAX_SLUG_LENGTH)
            : $form->slug;
        if (Post::query()->where(['slug' => $slug])->andWhere(['!=', 'id', $post->getId()])->exists()) {
            $form->getValidationResult()->addError(
                sprintf('Post with slug "%s" already exist.', $slug),
                valuePath: ['slug'],
            );
            return $this->renderForm($form);
        }

        $post->title = $form->title;
        $post->body = $form->body;
        $post->slug = $slug;
        $post->status = $form->status;
        $post->publication_date = $form->publicationDate;
        $post->updated_at = new DateTimeImmutable();
        $post->updated_by = $this->authenticatedUserProvider->getId();
        $post->save();
        $post->unlinkAll('categories', true);
        foreach (Category::query()->where(['id' => $form->categoryIds])->all() as $category) {
            /** @var Category $category */
            $post->link(
                'categories',
                $category,
            );
        }

        $this->contentNotices->success(
            sprintf(
                'Post "%s" is updated.',
                $form->title,
            ),
        );
        return $this->responseFactory->temporarilyRedirect(
            $this->urlGenerator->postUpdate($post->getId()),
        );
    }

    private function renderForm(Form $form): ResponseInterface
    {
        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            ['form' => $form],
        );
    }
}
