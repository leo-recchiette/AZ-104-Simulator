FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    QUESTIONS_JSON=/data/questions.json

WORKDIR /app

COPY src/AZ-104.Simulator.Importer/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY src/AZ-104.Simulator.Importer/import_questions.py ./
COPY dataset/az104_606_domande.json /data/questions.json

ENTRYPOINT ["python", "import_questions.py"]
