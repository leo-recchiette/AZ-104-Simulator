CONTAINER = az-104-simulator-pipeline
SLN = AZ-104.Simulator.sln
FE = /work/src/AZ-104.Simulator.Web

.PHONY: setup build test teardown

setup:
	docker compose -f docker-compose.pipeline.yml up --build -d

build:
	docker exec $(CONTAINER) dotnet build $(SLN)
	docker exec -w $(FE) $(CONTAINER) npm ci
	docker exec -w $(FE) $(CONTAINER) npm run build

test:
	docker exec $(CONTAINER) dotnet test --no-build $(SLN)
	docker exec -w $(FE) $(CONTAINER) npm run lint

teardown:
	docker compose -f docker-compose.pipeline.yml down -v --rmi local
