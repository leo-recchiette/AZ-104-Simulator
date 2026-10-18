CONTAINER = az-104-simulator-pipeline
TESTS = AZ-104.Simulator.BE/AZ-104.Simulator.Api.Tests
FE = /work/AZ-104.Simulator.FE

.PHONY: setup build test teardown

setup:
	docker compose -f docker-compose.pipeline.yml up --build -d

build:
	docker exec $(CONTAINER) dotnet build $(TESTS)
	docker exec -w $(FE) $(CONTAINER) npm ci
	docker exec -w $(FE) $(CONTAINER) npm run build

test:
	docker exec $(CONTAINER) dotnet test --no-build $(TESTS)
	docker exec -w $(FE) $(CONTAINER) npm run lint

teardown:
	docker compose -f docker-compose.pipeline.yml down -v --rmi local
