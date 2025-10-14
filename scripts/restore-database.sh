#!/bin/bash

# ========================================
# Database Restore Script
# ========================================
# Restore PostgreSQL database from backup
# 
# Usage:
#   ./scripts/restore-database.sh [backup_file]
#   ./scripts/restore-database.sh /backups/production/backup_20240115_120000.sql.gz
#   ./scripts/restore-database.sh latest  # Restore latest backup
# ========================================

set -e  # Exit on error

# Configuration
BACKUP_FILE=$1
ENVIRONMENT=${2:-production}
BACKUP_DIR="/backups/${ENVIRONMENT}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

confirm() {
    read -p "$1 [y/N]: " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Validation
if [ -z "$BACKUP_FILE" ]; then
    log_error "Usage: $0 <backup_file> [environment]"
    log_error "Example: $0 /backups/production/backup_20240115_120000.sql.gz"
    log_error "Example: $0 latest production"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL environment variable is not set"
    exit 1
fi

# Handle 'latest' keyword
if [ "$BACKUP_FILE" = "latest" ]; then
    BACKUP_FILE="${BACKUP_DIR}/latest.sql.gz"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Warning and confirmation
log_warn "⚠️  WARNING: This will REPLACE the current database!"
log_warn "Database: $DATABASE_URL"
log_warn "Backup file: $BACKUP_FILE"
log_warn ""

if ! confirm "Are you sure you want to proceed?"; then
    log_info "Restore cancelled"
    exit 0
fi

if ! confirm "This action cannot be undone. Continue?"; then
    log_info "Restore cancelled"
    exit 0
fi

# Create a safety backup before restore
log_info "Creating safety backup of current database..."
SAFETY_BACKUP="/tmp/pre_restore_backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump "$DATABASE_URL" > "$SAFETY_BACKUP"
log_info "Safety backup saved to: $SAFETY_BACKUP"

# Decompress if needed
RESTORE_FILE="$BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    log_info "Decompressing backup..."
    RESTORE_FILE="/tmp/restore_temp_$(date +%Y%m%d_%H%M%S).sql"
    gunzip -c "$BACKUP_FILE" > "$RESTORE_FILE"
fi

# Restore database
log_info "Restoring database..."
log_info "This may take several minutes..."

if psql "$DATABASE_URL" < "$RESTORE_FILE"; then
    log_info "✅ Database restored successfully!"
    
    # Clean up temp file
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        rm "$RESTORE_FILE"
    fi
    
    # Run Prisma migrations to ensure schema is up to date
    log_info "Running Prisma migrations..."
    cd "$(dirname "$0")/../apps/backend"
    npx prisma migrate deploy
    
    log_info "Restore completed successfully!"
    log_info "Safety backup available at: $SAFETY_BACKUP"
    
    # Send notification
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"✅ Database restored successfully\",
                \"blocks\": [{
                    \"type\": \"section\",
                    \"text\": {
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Database Restore* :recycle:\n*Environment:* ${ENVIRONMENT}\n*Backup:* $(basename $BACKUP_FILE)\n*Status:* Success\"
                    }
                }]
            }" > /dev/null 2>&1
    fi
    
    exit 0
else
    log_error "❌ Database restore failed!"
    log_error "Attempting to restore from safety backup..."
    
    # Restore from safety backup
    if psql "$DATABASE_URL" < "$SAFETY_BACKUP"; then
        log_info "Original database restored from safety backup"
    else
        log_error "Failed to restore from safety backup!"
        log_error "Manual intervention required!"
    fi
    
    # Clean up temp file
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        rm -f "$RESTORE_FILE"
    fi
    
    # Send notification
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"❌ Database restore failed\",
                \"blocks\": [{
                    \"type\": \"section\",
                    \"text\": {
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Database Restore* :x:\n*Environment:* ${ENVIRONMENT}\n*Backup:* $(basename $BACKUP_FILE)\n*Status:* Failed\"
                    }
                }]
            }" > /dev/null 2>&1
    fi
    
    exit 1
fi
