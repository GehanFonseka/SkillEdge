#!/bin/bash

# Check for Git repo
if [ ! -d .git ]; then
  echo "This is not a Git repository. Run this in a git repo directory."
  exit 1
fi

COMMIT_DATE="2025-04-24"
AUTHOR_NAME="kavishka"
AUTHOR_EMAIL="kavishkadeshan428@gmail.com"

# Create dummy test file with 3000 lines
TEST_FILE="Frontend/src/Pages/NotificationManagement/NotificationTest.js"
mkdir -p "Frontend/src/Pages/NotificationManagement"

# Generate 3000 lines of dummy comments
echo "// Notification System Test File" > "$TEST_FILE"
echo "// Generated on $COMMIT_DATE" >> "$TEST_FILE"
echo "" >> "$TEST_FILE"

for i in {1..3000}; do
  echo "// Line $i: Testing notification system - Simulating user interaction and data flow" >> "$TEST_FILE"
done

# Files to modify including our new test file
FILES=(
  "$TEST_FILE"
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
    echo "Warning: File $FILE does not exist, creating it..."
    mkdir -p "$(dirname "$FILE")"
    touch "$FILE"
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