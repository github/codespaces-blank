<?php

declare(strict_types=1);

namespace App\UseCase\FakeData;

use App\Domain\Category\Category;
use App\Domain\Post\Post;
use App\Domain\Post\PostStatus;
use App\Domain\User\AuthKeyGenerator;
use App\Domain\User\User;
use App\Presentation\Site\Access\Role;
use DateTimeImmutable;
use Faker\Factory;
use Faker\Generator;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Yiisoft\Db\Connection\ConnectionInterface;
use Yiisoft\Rbac\ManagerInterface;
use Yiisoft\Security\PasswordHasher;
use Yiisoft\Yii\Console\ExitCode;

#[AsCommand(
    name: 'fake-data',
    description: 'Fill database with fake data',
)]
final class FakeDataCommand extends Command
{
    private const string ADMIN_LOGIN = 'admin';
    private const string ADMIN_PASSWORD = 'q1w2e3r4';
    private const int USERS_COUNT = 5;
    private const int CATEGORIES_COUNT = 10;
    private const int POSTS_COUNT = 23;

    private Generator $faker;

    public function __construct(
        private readonly PasswordHasher $passwordHasher,
        private readonly AuthKeyGenerator $authKeyGenerator,
        private readonly ConnectionInterface $db,
        private readonly ManagerInterface $rbacManager,
    ) {
        parent::__construct();
        $this->faker = Factory::create();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->info('Clearing existing data...');
        $this->clearData();

        $io->info('Creating admin user...');
        $adminUser = $this->createAdministrator();

        $io->info('Creating ' . self::USERS_COUNT . ' fake users...');
        $users = $this->createFakeUsers();
        $users[] = $adminUser;

        $io->info('Creating ' . self::CATEGORIES_COUNT . ' fake categories...');
        $categories = $this->createFakeCategories();

        $io->info('Creating ' . self::POSTS_COUNT . ' fake posts...');
        $this->createFakePosts($users, $categories);

        $io->success('Fake data has been created successfully!');
        $io->table(['Type', 'Count'], [
            ['Administrator', '1 (login: ' . self::ADMIN_LOGIN . ', password: ' . self::ADMIN_PASSWORD . ')'],
            ['Editors', (string) self::USERS_COUNT],
            ['Categories', (string) self::CATEGORIES_COUNT],
            ['Posts', (string) self::POSTS_COUNT],
        ]);

        return ExitCode::OK;
    }

    private function clearData(): void
    {
        $this->db->createCommand()->delete('post_category')->execute();
        $this->db->createCommand()->delete('post')->execute();
        $this->db->createCommand()->delete('category')->execute();
        $this->db->createCommand()->delete('user')->execute();
    }

    private function createAdministrator(): User
    {
        $user = new User();
        $user->login = 'admin';
        $user->name = 'Administrator';
        $user->password_hash = $this->passwordHasher->hash('q1w2e3r4');
        $user->auth_key = $this->authKeyGenerator->generate();

        $user->save();
        $this->rbacManager->assign(Role::Admin->value, $user->getId());

        return $user;
    }

    /**
     * @return list<User>
     */
    private function createFakeUsers(): array
    {
        $users = [];
        for ($i = 0; $i < self::USERS_COUNT; $i++) {
            $user = new User();
            $user->login = $this->faker->unique()->userName;
            $user->name = $this->faker->name;
            $user->password_hash = $this->passwordHasher->hash($this->faker->password(8, 12));
            $user->auth_key = $this->authKeyGenerator->generate();
            $user->save();
            $users[] = $user;
        }

        return $users;
    }

    /**
     * @return list<Category>
     */
    private function createFakeCategories(): array
    {
        $categories = [];
        for ($i = 0; $i < self::CATEGORIES_COUNT; $i++) {
            /** @var string $name */
            $name = $this->faker->unique()->words(2, true);

            $category = new Category();
            $category->name = $name;
            $category->slug = $this->createSlug($name);
            $category->desc = $this->faker->sentence(10);
            $category->save();
            $categories[] = $category;
        }

        return $categories;
    }

    /**
     * @param list<User> $users
     * @param list<Category> $categories
     */
    private function createFakePosts(array $users, array $categories): void
    {
        for ($i = 0; $i < self::POSTS_COUNT; $i++) {
            /** @var list<Category> $selectedCategories */
            $selectedCategories = $this->faker->randomElements(
                $categories,
                $this->faker->numberBetween(1, 3),
            );

            /** @var string $body */
            $body = $this->faker->paragraphs(5, true);

            $post = new Post();
            $post->title = $this->faker->sentence(6, false);
            $post->body = $body;
            $post->slug = $this->createSlug($post->title);
            $post->publication_date = $this->faker->boolean(80) ? new DateTimeImmutable() : null;
            $post->created_by = $post->updated_by = $users[array_rand($users)]->getId();
            $post->created_at = $post->updated_at = new DateTimeImmutable();
            $post->status = $post->publication_date === null ? PostStatus::Draft : PostStatus::Published;
            $post->save();
            foreach ($selectedCategories as $category) {
                $post->link('categories', $category);
            }
        }
    }

    /**
     * @return non-empty-string
     */
    private function createSlug(string $text): string
    {
        /** @var non-empty-string */
        return strtolower(
            substr(
                trim((string) preg_replace('/[^A-Za-z0-9-]+/', '-', $text), '-'),
                0,
                50,
            ),
        );
    }
}
