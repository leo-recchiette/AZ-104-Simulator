# Del dataset servono solo questions.json e certificationSettings.json, nella loro struttura <vendor>/<certificazione>/: e' il
# nome della cartella a dire a quale certificazione appartengono. Zip delle immagini e Markdown restano
# in questa fase e non arrivano nell'immagine finale.
FROM python:3.13-slim AS dataset
COPY dataset/ /dataset/
RUN find /dataset -type f ! -name questions.json ! -name certificationSettings.json -delete

FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DATASET_DIR=/data

WORKDIR /app

COPY src/AZ-104.Simulator.Importer/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY src/AZ-104.Simulator.Importer/import_questions.py ./
COPY --from=dataset /dataset/ /data/

ENTRYPOINT ["python", "import_questions.py"]
