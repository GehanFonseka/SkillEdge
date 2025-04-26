package backend.LearningPlan.controller;

import backend.exception.ResourceNotFoundException;
import backend.exception.ResourceNotFoundException;
import backend.LearningPlan.model.LearningPlanModel;
import backend.Notification.model.NotificationModel;
import backend.LearningPlan.repository.LearningPlanRepository;
import backend.Notification.repository.NotificationRepository;
import backend.User.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class LearningPlanController {
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    private final Path root = Paths.get("uploads/plan");
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    //Insert
    @PostMapping("/learningPlan")
    public LearningPlanModel newLearningSystemModel(@RequestBody LearningPlanModel newLearningPlanModel) {
        System.out.println("Received data: " + newLearningPlanModel); // Debugging line
        if (newLearningPlanModel.getPostOwnerID() == null || newLearningPlanModel.getPostOwnerID().isEmpty()) {
            throw new IllegalArgumentException("PostOwnerID is required."); // Ensure postOwnerID is provided
        }
        // Fetch user's full name from UserRepository
        String postOwnerName = userRepository.findById(newLearningPlanModel.getPostOwnerID())
                .map(user -> user.getFullname())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for ID: " + newLearningPlanModel.getPostOwnerID()));
        newLearningPlanModel.setPostOwnerName(postOwnerName);

        // Set current date and time
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        newLearningPlanModel.setCreatedAt(currentDateTime);

        return learningPlanRepository.save(newLearningPlanModel); 
    }

    @PostMapping("/learningPlan/planUpload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String extension = file.getOriginalFilename()
                    .substring(file.getOriginalFilename().lastIndexOf("."));
            String filename = UUID.randomUUID() + extension;
            Files.copy(file.getInputStream(), this.root.resolve(filename));
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @GetMapping("/learningPlan")
    List<LearningPlanModel> getAll() {
        List<LearningPlanModel> posts = learningPlanRepository.findAll();
        posts.forEach(post -> {
            if (post.getPostOwnerID() != null) {
                String postOwnerName = userRepository.findById(post.getPostOwnerID())
                        .map(user -> user.getFullname())
                        .orElse("Unknown User");
                post.setPostOwnerName(postOwnerName);
            }
        });
        return posts;
    }

    @GetMapping("/learningPlan/{id}")
    LearningPlanModel getById(@PathVariable String id) {
        LearningPlanModel post = learningPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        if (post.getPostOwnerID() != null) {
            String postOwnerName = userRepository.findById(post.getPostOwnerID())
                    .map(user -> user.getFullname())
                    .orElse("Unknown User");
            post.setPostOwnerName(postOwnerName);
        }
        return post;
    }

    @PutMapping("/learningPlan/{id}")
    LearningPlanModel update(@RequestBody LearningPlanModel newLearningPlanModel, @PathVariable String id) {
        return learningPlanRepository.findById(id)
                .map(learningPlanModel -> {
                    learningPlanModel.setTitle(newLearningPlanModel.getTitle());
                    learningPlanModel.setDescription(newLearningPlanModel.getDescription());
                    learningPlanModel.setContentURL(newLearningPlanModel.getContentURL());
                    learningPlanModel.setTags(newLearningPlanModel.getTags());
                    learningPlanModel.setImageUrl(newLearningPlanModel.getImageUrl());
                    learningPlanModel.setStartDate(newLearningPlanModel.getStartDate()); // Update startDate
                    learningPlanModel.setEndDate(newLearningPlanModel.getEndDate());     // Update endDate
                    learningPlanModel.setCategory(newLearningPlanModel.getCategory());  // Update category
                    
                    if (newLearningPlanModel.getPostOwnerID() != null && !newLearningPlanModel.getPostOwnerID().isEmpty()) {
                        learningPlanModel.setPostOwnerID(newLearningPlanModel.getPostOwnerID());
                        // Fetch and update the real name of the post owner
                        String postOwnerName = userRepository.findById(newLearningPlanModel.getPostOwnerID())
                                .map(user -> user.getFullname())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found for ID: " + newLearningPlanModel.getPostOwnerID()));
                        learningPlanModel.setPostOwnerName(postOwnerName);
                    }
                    
                    learningPlanModel.setTemplateID(newLearningPlanModel.getTemplateID()); // Update templateID
                    return learningPlanRepository.save(learningPlanModel);
                }).orElseThrow(() -> new ResourceNotFoundException(id));
    }

    @DeleteMapping("/learningPlan/{id}")
    public void delete(@PathVariable String id) {
        learningPlanRepository.deleteById(id);
    }

    @GetMapping("/learningPlan/planImages/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Error loading image: " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void sendExpiryNotifications() {
        List<LearningPlanModel> plans = learningPlanRepository.findAll();
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        plans.forEach(plan -> {
            if (plan.getEndDate() != null && plan.getPostOwnerID() != null) {
                try {
                    LocalDateTime endDate = LocalDateTime.parse(plan.getEndDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                    LocalDateTime threeDaysBefore = endDate.minusDays(3);

                    if (threeDaysBefore.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")).equals(currentDate)) {
                        // Check if a notification already exists for this plan and user
                        boolean notificationExists = notificationRepository.findByUserId(plan.getPostOwnerID())
                                .stream()
                                .anyMatch(notification -> notification.getMessage().contains(plan.getTitle()));

                        if (!notificationExists) {
                            NotificationModel notification = new NotificationModel();
                            notification.setUserId(plan.getPostOwnerID());
                            notification.setMessage("Your learning plan \"" + plan.getTitle() + "\" will expire soon.");
                            notification.setCreatedAt(currentDate);
                            notification.setRead(false);
                            notificationRepository.save(notification);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error processing plan with ID: " + plan.getId() + ". Error: " + e.getMessage());
                }
            }
        });
    }
}
