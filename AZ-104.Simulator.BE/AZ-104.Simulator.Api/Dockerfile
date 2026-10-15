# Il build context e' la radice del repo, come per gli altri servizi.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY AZ-104.Simulator.BE/AZ-104.Simulator.Api/AZ-104.Simulator.Api.csproj AZ-104.Simulator.BE/AZ-104.Simulator.Api/
RUN dotnet restore AZ-104.Simulator.BE/AZ-104.Simulator.Api/AZ-104.Simulator.Api.csproj

COPY AZ-104.Simulator.BE/AZ-104.Simulator.Api/ AZ-104.Simulator.BE/AZ-104.Simulator.Api/
RUN dotnet publish AZ-104.Simulator.BE/AZ-104.Simulator.Api/AZ-104.Simulator.Api.csproj -c Release -o /app --no-restore

# Screenshot delle domande, serviti su /images/<file>. Nel repo c'e' solo lo zip, scompattato in
# questa fase usa-e-getta: dopo un aggiornamento dello zip va ricostruita l'immagine.
RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*
COPY AZ-104.Simulator.Dataset/az104_Dataset_Images.zip /tmp/images.zip
RUN mkdir -p /images && unzip -q -j /tmp/images.zip -d /images && rm /tmp/images.zip

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .
COPY --from=build /images/ /app/wwwroot/images/

EXPOSE 8080
ENTRYPOINT ["dotnet", "AZ-104.Simulator.Api.dll"]
