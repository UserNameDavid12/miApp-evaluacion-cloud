#!/bin/bash
# deploy.sh - Levanta el entorno completo con Docker Compose

echo "🚀 Levantando el entorno..."
docker compose up -d --build

if [ $? -eq 0 ]; then
    echo "✅ Entorno levantado correctamente"
    echo "🌐 Backend: http://localhost:8080"
    echo "🌐 Frontend: http://localhost:3000"
else
    echo "❌ Error al levantar el entorno"
fi