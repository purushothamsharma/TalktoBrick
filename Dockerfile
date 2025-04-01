FROM rasa/rasa:3.6.15-pro

# Copy project files
COPY . /app

# Install dependencies
USER root
RUN pip install --no-cache-dir -r requirements.txt

# Switch back to non-root user
USER 1001

# Set environment variables
ENV RASA_MODEL_SERVER=${RASA_MODEL_SERVER}
ENV RASA_MODEL_TOKEN=${RASA_MODEL_TOKEN}
ENV RASA_DB_URL=${RASA_DB_URL}
ENV REDIS_URL=${REDIS_URL}
ENV RABBITMQ_URL=${RABBITMQ_URL}

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5005/health || exit 1

# Command to run the server
CMD ["run", "--enable-api", "--cors", "*"]