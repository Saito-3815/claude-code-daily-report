.PHONY: help build deploy run-local clean test lint format

# Project configuration
PROJECT_ID = daily-report-483209
SERVICE_NAME = daily-report
REGION = asia-northeast1
IMAGE_NAME = gcr.io/$(PROJECT_ID)/$(SERVICE_NAME)
PORT = 8080

help:
	@echo "Available commands:"
	@echo "  make build         - Build Docker image"
	@echo "  make deploy        - Deploy to Cloud Run"
	@echo "  make run-local     - Run Docker container locally"
	@echo "  make clean         - Remove Docker images"
	@echo "  make test          - Run tests"
	@echo "  make lint          - Run linter"
	@echo "  make format        - Format code"
	@echo "  make setup-gcloud  - Setup gcloud configuration"

setup-gcloud:
	gcloud config set project $(PROJECT_ID)
	gcloud auth configure-docker

build:
	@echo "Building Docker image..."
	docker build -t $(IMAGE_NAME):latest .

push:
	@echo "Pushing image to GCR..."
	docker push $(IMAGE_NAME):latest

deploy: build push
	@echo "Deploying to Cloud Run..."
	gcloud run deploy $(SERVICE_NAME) \
		--image $(IMAGE_NAME):latest \
		--platform managed \
		--region $(REGION) \
		--allow-unauthenticated \
		--port $(PORT) \
		--memory 512Mi \
		--cpu 1 \
		--min-instances 0 \
		--max-instances 10 \
		--project $(PROJECT_ID)

run-local:
	@echo "Running Docker container locally..."
	docker run -p $(PORT):$(PORT) \
		-e PORT=$(PORT) \
		$(IMAGE_NAME):latest

clean:
	@echo "Cleaning up Docker images..."
	docker rmi $(IMAGE_NAME):latest || true

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

ci: lint test
	@echo "CI checks passed!"
