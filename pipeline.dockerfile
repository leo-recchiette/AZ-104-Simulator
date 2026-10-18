FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine
RUN apk add --no-cache nodejs npm
WORKDIR /work
