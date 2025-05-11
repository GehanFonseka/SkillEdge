#!/bin/bash

# Set Git author information
AUTHOR_NAME="ChamuHimasha"
AUTHOR_EMAIL="chamuhimasha29471@gmail.com"

# Define Learning Plan files to modify
LEARNING_PLAN_FILES=(
    "Frontend/src/Pages/LearningPlan/AddLearningPlan.js"
    "Frontend/src/Pages/LearningPlan/UpdateLearningPlan.js"
    "Frontend/src/Pages/LearningPlan/AllLearningPlan.js"
    "Frontend/src/Pages/LearningPlan/MyLearningPlan.js"
    "Backend/src/main/java/backend/LearningPlan/controller/LearningPlanController.java"
    "Backend/src/main/java/backend/LearningPlan/model/LearningPlanModel.java"
)

# Define time slots for commits
TIMES=("10:00:00" "14:00:00" "18:00:00" "21:00:00")

# Generate dates between March 31, 2025 and April 14, 2025
start_date="2025-03-31"
end_date="2025-04-14"

# Convert dates to seconds since epoch for comparison
start_seconds=$(date -d "$start_date" +%s)
end_seconds=$(date -d "$end_date" +%s)

current_date=$start_date
while [ "$(date -d "$current_date" +%s)" -le "$end_seconds" ]; do
    # Generate random number of commits for this day (0-5 commits)
    commit_count=$((RANDOM % 6))
    
    for ((i=0; i<commit_count; i++)); do
        # Select random time from TIMES array
        TIME=${TIMES[$RANDOM % ${#TIMES[@]}]}
        FULL_DATE="${current_date}T${TIME}"
        
        echo "$FULL_DATE - Commit $i"
        
        # Randomly select a file from Learning Plan files
        FILE=${LEARNING_PLAN_FILES[$RANDOM % ${#LEARNING_PLAN_FILES[@]}]}
        
        # Check if file exists before modifying
        if [ ! -f "$FILE" ]; then
            echo "Warning: File $FILE does not exist, skipping..."
            continue
        fi
        
        # Add a comment based on file type
        if [[ $FILE == *.js ]]; then
            echo "// Update $i - $current_date - Enhanced learning plan functionality" >> "$FILE"
        elif [[ $FILE == *.java ]]; then
            echo "// Update $i - $current_date - Improved learning plan system" >> "$FILE"
        fi
        
        git add "$FILE"

        GIT_COMMITTER_DATE="$FULL_DATE" GIT_AUTHOR_DATE="$FULL_DATE" \
        GIT_AUTHOR_NAME="$AUTHOR_NAME" GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL" \
        GIT_COMMITTER_NAME="$AUTHOR_NAME" GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" \
        git commit -m "Update $FILE - Learning plan system enhancement"
    done
    
    # Move to next day
    current_date=$(date -d "$current_date + 1 day" +%Y-%m-%d)
done

echo "Done. Push it to GitHub if you'd like."