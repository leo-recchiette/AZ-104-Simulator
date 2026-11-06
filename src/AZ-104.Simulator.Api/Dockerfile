# Il build context e' la radice del repo, come per gli altri servizi.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/AZ-104.Simulator.Api/AZ-104.Simulator.Api.csproj src/AZ-104.Simulator.Api/
RUN dotnet restore src/AZ-104.Simulator.Api/AZ-104.Simulator.Api.csproj

COPY src/AZ-104.Simulator.Api/ src/AZ-104.Simulator.Api/
RUN dotnet publish src/AZ-104.Simulator.Api/AZ-104.Simulator.Api.csproj -c Release -o /app --no-restore

# Screenshot delle domande, serviti su /images/<certificazione>/<file>: uno zip per certificazione, in
# dataset/<vendor>/<certificazione>/images.zip, che puo' anche mancare. Accanto, badge.png (anche lui
# facoltativo) finisce in /images/<certificazione>/badge.png. Nel repo ci sono solo gli zip,
# scompattati in questa fase usa-e-getta: dopo un aggiornamento del dataset va ricostruita l'immagine.
RUN apt-get update && apt-get install -y --no-install-recommends unzip && rm -rf /var/lib/apt/lists/*
COPY dataset/ /tmp/dataset/
RUN mkdir -p /images && \
    for zip in /tmp/dataset/*/*/images.zip; do \
        [ -f "$zip" ] || continue; \
        certification=$(basename "$(dirname "$zip")"); \
        mkdir -p "/images/$certification" && unzip -q -j "$zip" -d "/images/$certification" || exit 1; \
    done && \
    for badge in /tmp/dataset/*/*/badge.png; do \
        [ -f "$badge" ] || continue; \
        certification=$(basename "$(dirname "$badge")"); \
        mkdir -p "/images/$certification" && cp "$badge" "/images/$certification/badge.png" || exit 1; \
    done && \
    rm -rf /tmp/dataset

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .
COPY --from=build /images/ /app/wwwroot/images/

EXPOSE 8080
ENTRYPOINT ["dotnet", "AZ-104.Simulator.Api.dll"]
