#!/bin/bash
# backup.sh - Genera un backup de la base de datos

FECHA=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

docker exec miApp_db mysqldump -u root -p123 bd_ventas > $BACKUP_DIR/backup_$FECHA.sql

if [ $? -eq 0 ]; then
    echo "✅ Backup generado: $BACKUP_DIR/backup_$FECHA.sql"
else
    echo "❌ Error al generar el backup"
fi