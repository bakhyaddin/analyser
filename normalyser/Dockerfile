# Base stage
FROM python:3.11-slim AS development
WORKDIR /usr/src/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

# Build stage
FROM development AS build

ARG ENV=production
ENV ENV=${ENV}

# Set the default command
CMD ["python3", "./src/main.py"]
