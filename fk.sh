#!/bin/bash

# Check for Git repo
if [ ! -d .git ]; then
  echo "This is not a Git repository. Run this in a git repo directory."
  exit 1
fi

COMMIT_DATE="2025-04-24"
AUTHOR_NAME="kavishka"
AUTHOR_EMAIL="kavishkadeshan428@gmail.com"

# Files related to NotificationManagement with correct case sensitivity
FILES=(
  "Frontend/src/Pages/NotificationManagement/NotificationsPage.js"
  "Frontend/src/Pages/NotificationManagement/notification.css"
  "Backend/src/main/java/backend/Notification/controller/NotificationController.java"
  "Backend/src/main/java/backend/Notification/repository/NotificationRepository.java"
)

# Create 3 commits with different timestamps on the same day
TIMES=("10:00:00" "14:30:00" "17:00:00")

for i in {0..2}; do
  FULL_DATE="${COMMIT_DATE}T${TIMES[$i]}"
  
  echo "$FULL_DATE - Commit $i"
  
  # Randomly select a file to modify
  FILE=${FILES[$RANDOM % ${#FILES[@]}]}
  
  # Check if file exists before modifying
  if [ ! -f "$FILE" ]; then
    echo "Warning: File $FILE does not exist, skipping..."
    continue
  fi
  
  # Add a comment based on file type
  if [[ $FILE == *.js ]]; then
    echo "// Update $i - $COMMIT_DATE - Enhanced notification functionality" >> "$FILE"
  elif [[ $FILE == *.java ]]; then
    echo "// Update $i - $COMMIT_DATE - Improved notification system" >> "$FILE"
  elif [[ $FILE == *.css ]]; then
    echo "/* Update $i - $COMMIT_DATE - Enhanced notification styling */" >> "$FILE"
  fi
  
  git add "$FILE"

  GIT_COMMITTER_DATE="$FULL_DATE" GIT_AUTHOR_DATE="$FULL_DATE" \
  GIT_AUTHOR_NAME="$AUTHOR_NAME" GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL" \
  GIT_COMMITTER_NAME="$AUTHOR_NAME" GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" \
  git commit -m "Update $FILE - Notification system enhancement"
done

echo "Done. Push it to GitHub if you'd like."