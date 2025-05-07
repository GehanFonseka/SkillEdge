package backend.LearningPlan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "progressUpdates")
public class ProgressUpdateModel {
    @Id
    private String id;
    private String learningPlanId;
    private String userId;
    private String content;
    private String updateType;
    private int completionPercentage;
    private String[] skillsLearned;
    private String resourcesUsed;
    private String date;
    private String userName;

    // Constructor
    public ProgressUpdateModel() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getLearningPlanId() { return learningPlanId; }
    public void setLearningPlanId(String learningPlanId) { this.learningPlanId = learningPlanId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getUpdateType() { return updateType; }
    public void setUpdateType(String updateType) { this.updateType = updateType; }
    
    public int getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }
    
    public String[] getSkillsLearned() { return skillsLearned; }
    public void setSkillsLearned(String[] skillsLearned) { this.skillsLearned = skillsLearned; }
    
    public String getResourcesUsed() { return resourcesUsed; }
    public void setResourcesUsed(String resourcesUsed) { this.resourcesUsed = resourcesUsed; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}