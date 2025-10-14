#!/bin/bash

# ========================================
# Backup Cron Setup Script
# ========================================
# Sets up automated database backups using cron
#
# Usage:
#   ./scripts/setup-backups.sh
# ========================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Setting up automated database backups...${NC}"

# Make backup scripts executable
chmod +x "$(dirname "$0")/backup-database.sh"
chmod +x "$(dirname "$0")/restore-database.sh"

echo -e "${GREEN}✓${NC} Made backup scripts executable"

# Create backup directory
sudo mkdir -p /backups/production
sudo mkdir -p /backups/staging
sudo chown -R $USER:$USER /backups

echo -e "${GREEN}✓${NC} Created backup directories"

# Add cron jobs
CRON_FILE="/tmp/backup-cron"

# Backup production database daily at 2 AM
echo "0 2 * * * DATABASE_URL=\$PRODUCTION_DATABASE_URL $(pwd)/scripts/backup-database.sh production >> /var/log/db-backup.log 2>&1" > $CRON_FILE

# Backup staging database daily at 3 AM
echo "0 3 * * * DATABASE_URL=\$STAGING_DATABASE_URL $(pwd)/scripts/backup-database.sh staging >> /var/log/db-backup.log 2>&1" >> $CRON_FILE

# Install cron jobs
crontab -l > /tmp/current-cron 2>/dev/null || true
cat /tmp/current-cron $CRON_FILE | sort -u | crontab -
rm $CRON_FILE /tmp/current-cron

echo -e "${GREEN}✓${NC} Installed cron jobs"

# Create log file
sudo touch /var/log/db-backup.log
sudo chown $USER:$USER /var/log/db-backup.log

echo -e "${GREEN}✓${NC} Created log file"

# Display cron schedule
echo ""
echo -e "${YELLOW}Backup schedule:${NC}"
echo "  Production: Daily at 2:00 AM"
echo "  Staging:    Daily at 3:00 AM"
echo ""
echo -e "${YELLOW}Logs:${NC} /var/log/db-backup.log"
echo -e "${YELLOW}Backups:${NC} /backups/{production,staging}"
echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
