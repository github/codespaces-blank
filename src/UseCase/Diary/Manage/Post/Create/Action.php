<?php

declare(strict_types=1);

namespace App\UseCase\Diary\Manage\Post\Create;

use App\Domain\Category\Category;
use App\Domain\Post\Post;
use App\Presentation\Site\Identity\AuthenticatedUserProvider;
use App\Presentation\Site\Layout\ContentNotices\ContentNotices;
use App\Presentation\Site\ResponseFactory\ResponseFactory;
use App\Shared\UrlGenerator;
use DateTimeImmutable;
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
        private AuthenticatedUserProvider $authenticatedUserProvider,
        private Inflector $inflector,
    ) {}

    public function __invoke(ServerRequestInterface $request): ResponseInterface
    {
        /** @var array<int, string> $categories */
        $categories = Category::query()->select('name')->indexBy('id')->column();
        $form = new Form($categories);

        if (!$this->formHydrator->populateFromPostAndValidate($form, $request)) {
            return $this->renderForm($form);
        }

        $slug = $form->slug === ''
            ? mb_substr($this->inflector->toSlug($form->title), 0, Post::MAX_SLUG_LENGTH)
            : $form->slug;
        if (Post::query()->where(['slug' => $slug])->exists()) {
            $form->getValidationResult()->addError(
                sprintf('Post with slug "%s" already exist.', $slug),
                valuePath: ['slug'],
            );
            return $this->renderForm($form);
        }

        $currentUserId = $this->authenticatedUserProvider->getId();

        $post = new Post();
        $post->title = $form->title;
        $post->body = $form->body;
        $post->slug = $slug;
        $post->status = $form->status;
        $post->publication_date = $form->publicationDate;
        $post->created_by = $post->updated_by = $currentUserId;
        $post->created_at = $post->updated_at = new DateTimeImmutable();
        $post->save();
        foreach (Category::query()->where(['id' => $form->categoryIds])->all() as $category) {
            /** @var Category $category */
            $post->link('categories', $category);
        }

        $this->contentNotices->success(
            sprintf(
                'Post "%s" with ID "%s" is created.',
                $form->title,
                $post->getId(),
            ),
        );
        return $this->responseFactory->temporarilyRedirect($this->urlGenerator->generate('diary/manage/post/index'));
    }

    private function renderForm(Form $form): ResponseInterface
    {
        return $this->responseFactory->render(
            __DIR__ . '/template.php',
            ['form' => $form],
        );
    }
}
