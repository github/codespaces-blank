<p align="center">
    <a href="https://github.com/yiisoft" target="_blank">
        <img src="https://yiisoft.github.io/docs/images/yii_logo.svg" height="100px" alt="Yii">
    </a>
    <h1 align="center">Yii3 Demo Diary</h1>
    <br>
</p>

[![Build status](https://github.com/yiisoft/demo-diary/actions/workflows/build.yml/badge.svg)](https://github.com/yiisoft/demo-diary/actions/workflows/build.yml)
[![Code Coverage](https://codecov.io/gh/yiisoft/demo-diary/branch/master/graph/badge.svg?token=TDZ2bErTcN)](https://codecov.io/gh/yiisoft/demo-diary)
[![static analysis](https://github.com/yiisoft/demo-diary/workflows/static%20analysis/badge.svg)](https://github.com/yiisoft/demo-diary/actions?query=workflow%3A%22static+analysis%22)
[![type-coverage](https://shepherd.dev/github/yiisoft/demo-diary/coverage.svg)](https://shepherd.dev/github/yiisoft/demo-diary)

Demo diary application built on Yii3 framework using **vertical slice architecture** — code is organized
by features rather than technical layers. Demonstrates user management, category and post CRUD,
authentication, and database migrations.

**Features:**

- Diary with categories and posts (create, read, update, delete)
- User management with [GridView](https://github.com/yiisoft/yii-dataview) list powered by [htmx](https://htmx.org/) — pagination, sorting, and filtering work via AJAX without full page reloads
- Authentication and access control
- Database migrations via [Yii DB Migration](https://github.com/yiisoft/yii-db-migration)

## Requirements

- PHP 8.5 or higher.

## General usage

1. Clone this repository.

2. Move to your project root directory.

3. Install composer dependencies:

```shell
composer install

# or via docker
make init
```

4. Apply migrations:

```shell
# Linux
./yii migrate:up

# Windows
yii migrate:up

# or via docker
make migrate-up
```

5. Run application:

```shell
# Linux
./yii serve

# Windows
yii server

# or via docker
make up
```

The application will be started on http://127.0.0.1:8080/.


## Support

If you need help or have a question, check out [Yii Community Resources](https://www.yiiframework.com/community).

## License

The Yii3 Demo Diary is free software. It is released under the terms of the BSD License.
Please see [`LICENSE`](./LICENSE.md) for more information.

Maintained by [Yii Software](https://www.yiiframework.com/).

## Support the project

[![Open Collective](https://img.shields.io/badge/Open%20Collective-sponsor-7eadf1?logo=open%20collective&logoColor=7eadf1&labelColor=555555)](https://opencollective.com/yiisoft)

## Follow updates

[![Official website](https://img.shields.io/badge/Powered_by-Yii_Framework-green.svg?style=flat)](https://www.yiiframework.com/)
[![Twitter](https://img.shields.io/badge/twitter-follow-1DA1F2?logo=twitter&logoColor=1DA1F2&labelColor=555555?style=flat)](https://twitter.com/yiiframework)
[![Telegram](https://img.shields.io/badge/telegram-join-1DA1F2?style=flat&logo=telegram)](https://t.me/yii3en)
[![Facebook](https://img.shields.io/badge/facebook-join-1DA1F2?style=flat&logo=facebook&logoColor=ffffff)](https://www.facebook.com/groups/yiitalk)
[![Slack](https://img.shields.io/badge/slack-join-1DA1F2?style=flat&logo=slack)](https://yiiframework.com/go/slack)
