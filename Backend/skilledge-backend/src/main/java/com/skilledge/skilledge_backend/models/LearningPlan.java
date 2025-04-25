package com.skilledge.skilledge_backend.models;


import jakarta.persistence.*;
import java.util.List;

@Entity
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @ElementCollection
    private List<String> topics;
    
    @ElementCollection
    private List<String> resources;
    
    private String completionDate;

    // Constructors
    public LearningPlan() {}

    public LearningPlan(String title, List<String> topics, List<String> resources, String completionDate) {
        this.title = title;
        this.topics = topics;
        this.resources = resources;
        this.completionDate = completionDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }

    public List<String> getResources() { return resources; }
    public void setResources(List<String> resources) { this.resources = resources; }

    public String getCompletionDate() { return completionDate; }
    public void setCompletionDate(String completionDate) { this.completionDate = completionDate; }
}
