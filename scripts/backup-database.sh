#!/bin/bash

# ========================================
# Database Backup Script
# ========================================
# Automated PostgreSQL database backup with retention policy
# 
# Usage:
#   ./scripts/backup-database.sh [environment]
#   ./scripts/backup-database.sh production
#   ./scripts/backup-database.sh staging
# ========================================

set -e  # Exit on error

# Configuration
ENVIRONMENT=${1:-production}
BACKUP_DIR="/backups/${ENVIRONMENT}"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${ENVIRONMENT}_${TIMESTAMP}.sql"
LATEST_LINK="${BACKUP_DIR}/latest.sql"

# Colors for output
RED='\033[0:31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL environment variable is not set"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log_info "Starting database backup for ${ENVIRONMENT} environment..."
log_info "Backup will be saved to: ${BACKUP_FILE}"

# Create backup
if pg_dump "$DATABASE_URL" > "$BACKUP_FILE"; then
    log_info "Database backup completed successfully"
    
    # Compress backup
    log_info "Compressing backup..."
    gzip "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    # Get file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_info "Backup size: ${SIZE}"
    
    # Create symlink to latest backup
    ln -sf "$BACKUP_FILE" "$LATEST_LINK.gz"
    log_info "Updated latest backup symlink"
    
    # Upload to S3 (if configured)
    if [ ! -z "$AWS_S3_BUCKET" ]; then
        log_info "Uploading backup to S3..."
        aws s3 cp "$BACKUP_FILE" "s3://${AWS_S3_BUCKET}/backups/${ENVIRONMENT}/$(basename $BACKUP_FILE)"
        log_info "Backup uploaded to S3"
    fi
    
    # Clean up old backups
    log_info "Cleaning up backups older than ${RETENTION_DAYS} days..."
    find "$BACKUP_DIR" -name "backup_${ENVIRONMENT}_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
    OLD_COUNT=$(find "$BACKUP_DIR" -name "backup_${ENVIRONMENT}_*.sql.gz" -type f | wc -l)
    log_info "Retained ${OLD_COUNT} recent backups"
    
    # Send notification (if Slack webhook is configured)
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"✅ Database backup completed\",
                \"blocks\": [{
                    \"type\": \"section\",
                    \"text\": {
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Database Backup* :floppy_disk:\n*Environment:* ${ENVIRONMENT}\n*Size:* ${SIZE}\n*Status:* Success\"
                    }
                }]
            }" > /dev/null 2>&1
    fi
    
    log_info "Backup process completed successfully!"
    exit 0
else
    log_error "Database backup failed!"
    
    # Send failure notification
    if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"❌ Database backup failed\",
                \"blocks\": [{
                    \"type\": \"section\",
                    \"text\": {
                        \"type\": \"mrkdwn\",
                        \"text\": \"*Database Backup* :x:\n*Environment:* ${ENVIRONMENT}\n*Status:* Failed\"
                    }
                }]
            }" > /dev/null 2>&1
    fi
    
    exit 1
fi
