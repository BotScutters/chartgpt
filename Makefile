SHELL := /bin/bash
TAG := $(shell date +%y%m%d)
REPO := "todo"
FRONTEND_IMAGE := chartgpt-frontend
BACKEND_IMAGE := chartgpt-backend

launch: ## Launches the frontend and backend
	@echo "Starting the app..."
	cd /app/backend && gunicorn -b :5000 --reload app:app & cd /app/frontend && npm run dev
	@echo "App started!"

docker: ## Build images
	docker compose build

up: ## Start containers
	docker compose up -d

down: ## Stop containers
	docker compose down

restart: ## Restart containers
	docker compose restart

logs: ## Show logs
	docker compose logs -f

ps: ## Show containers
	docker compose ps

package-lock: ## Update package-lock.json
	cd frontend && npm install

#################################################################################
# Self Documenting Commands                                                     #
#################################################################################
# Inspired by <http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html>

.DEFAULT_GOAL := help

.PHONY: help

help:  ## Show this help.
	@recipe_max_length=`grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk '{print length($$1)}' | sort -nr | head -1`; \
	grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	sort | awk -v recipe_max_length=$$recipe_max_length 'BEGIN {FS = ":.*?## "}; \
	{printf "\033[36m%-" recipe_max_length "s\033[0m %s\n", $$1, $$2}'
