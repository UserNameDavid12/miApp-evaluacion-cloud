#!/bin/bash
# restore.sh - Restaura la base de datos desde un backup

BACKUP_DIR="./backups"
ARCHIVO=$1

if [ -z "$ARCHIVO" ]; then
    echo "❌ Uso: ./restore.sh <archivo_backup.sql>"
    exit 1
fi

if [ ! -f "$BACKUP_DIR/$ARCHIVO" ]; then
    echo "❌ El archivo $BACKUP_DIR/$ARCHIVO no existe"
    exit 1
fi

docker exec -i miApp_db mysql -u root -p123 bd_ventas < $BACKUP_DIR/$ARCHIVO

if [ $? -eq 0 ]; then
    echo "✅ Restauración completada desde $ARCHIVO"
else
    echo "❌ Error al restaurar"
fi