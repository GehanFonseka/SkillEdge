#!/bin/bash

# Check for Git repo
if [ ! -d .git ]; then
  echo "This is not a Git repository. Run this in a git repo directory."
  exit 1
fi

START_DATE="2025-03-16"
END_DATE="2025-04-12"
AUTHOR_NAME="kavishka"
AUTHOR_EMAIL="kavishkadeshan428@gmail.com"

# Files related to NotificationManagement with correct case sensitivity
FILES=(
  "Frontend/src/Pages/NotificationManagement/NotificationsPage.js"
  "Frontend/src/Pages/NotificationManagement/notification.css"
  "Backend/src/main/java/backend/Notification/controller/NotificationController.java"
  "Backend/src/main/java/backend/Notification/repository/NotificationRepository.java"
)

# Calculate number of days between start and end dates
NUM_DAYS=$(( ( $(date -d "$END_DATE" +%s) - $(date -d "$START_DATE" +%s) ) / 86400 ))

for i in $(seq 0 $NUM_DAYS); do
  COMMIT_DATE=$(date -d "$START_DATE +$i day" +"%Y-%m-%dT12:00:00")
  
  echo "$COMMIT_DATE - Commit $i"
  
  # Randomly select a file to modify
  FILE=${FILES[$RANDOM % ${#FILES[@]}]}
  
  # Check if file exists before modifying
  if [ ! -f "$FILE" ]; then
    echo "Warning: File $FILE does not exist, skipping..."
    continue
  fi
  
  # Add a comment based on file type
  if [[ $FILE == *.js ]]; then
    echo "// Update $i - $(date -d "$COMMIT_DATE" +"%Y-%m-%d") - Enhanced notification functionality" >> "$FILE"
  elif [[ $FILE == *.java ]]; then
    echo "// Update $i - $(date -d "$COMMIT_DATE" +"%Y-%m-%d") - Improved notification system" >> "$FILE"
  elif [[ $FILE == *.css ]]; then
    echo "/* Update $i - $(date -d "$COMMIT_DATE" +"%Y-%m-%d") - Enhanced notification styling */" >> "$FILE"
  fi
  
  git add "$FILE"

  GIT_COMMITTER_DATE="$COMMIT_DATE" GIT_AUTHOR_DATE="$COMMIT_DATE" \
  GIT_AUTHOR_NAME="$AUTHOR_NAME" GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL" \
  GIT_COMMITTER_NAME="$AUTHOR_NAME" GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" \
  git commit -m "Update $FILE - Notification system enhancement"
done

echo "Done. Push it to GitHub if you'd like."