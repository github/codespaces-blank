.DEFAULT_GOAL := help

# Current user ID and group ID except MacOS where it conflicts with Docker abilities
ifeq ($(shell uname), Darwin)
    export UID=1000
    export GID=1000
else
    export UID=$(shell id -u)
    export GID=$(shell id -g)
endif

export COMPOSE_PROJECT_NAME=demo-diary

init: build composer-install codecept-build

build: ## Build docker image
	docker compose build

up: ## Up the dev environment
	docker compose up -d

down: ## Down the dev environment
	docker compose down --remove-orphans

clear: ## Remove development docker containers and volumes
	docker compose down --volumes --remove-orphans

shell: ## Get into container shell
	docker compose exec app /bin/bash

composer-install: ## Run composer install
	docker compose run --rm app composer install

composer-update: ## Run composer update
	docker compose run --rm app composer update

codecept-build: ## Run codeception build
	docker compose run --rm app composer codecept-build

test:
	docker compose run --rm app composer test

psalm: ## Run psalm static analysis
	docker compose run --rm app composer psalm

rector: ## Run rector code refactoring
	docker compose run --rm app composer rector

composer-dependency-analyzer: ## Run composer dependency analyzer
	docker compose run --rm app composer composer-dependency-analyser

cs-fix: ## Run code style fix
	docker compose run --rm app composer cs-fix

migrate-up: ## Run migrations
	docker compose run --rm app ./yii migrate:up --force-yes

fake-data: ## Generate fake data
	docker compose run --rm app ./yii fake-data

create-admin: ## Create admin user (admin / q1w2e3r4)
	docker compose run --rm app ./yii user:create-admin admin q1w2e3r4

# Output the help for each task, see https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
