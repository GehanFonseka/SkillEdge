package backend.LearningPlan.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.LearningPlan.model.ProgressUpdateModel;
import backend.LearningPlan.repository.ProgressUpdateRepository;
import backend.User.repository.UserRepository;

@RestController
@RequestMapping("/progress-updates")
@CrossOrigin("http://localhost:3000")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private UserRepository userRepository;

    // Create progress update
    @PostMapping
    public ResponseEntity<ProgressUpdateModel> createProgressUpdate(@RequestBody ProgressUpdateModel update) {
        update.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        String userName = userRepository.findById(update.getUserId())
                .map(user -> user.getFullname())
                .orElse("Unknown User");
        update.setUserName(userName);
        return ResponseEntity.ok(progressUpdateRepository.save(update));
    }

    // Get all updates for a learning plan
    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<ProgressUpdateModel>> getUpdatesByPlanId(@PathVariable String planId) {
        List<ProgressUpdateModel> updates = progressUpdateRepository.findByLearningPlanId(planId);
        return ResponseEntity.ok(updates);
    }

    // Get all updates for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdateModel>> getUpdatesByUserId(@PathVariable String userId) {
        List<ProgressUpdateModel> updates = progressUpdateRepository.findByUserId(userId);
        return ResponseEntity.ok(updates);
    }

    // Update a progress update
    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdateModel> updateProgressUpdate(
            @PathVariable String id, 
            @RequestBody ProgressUpdateModel update) {
        return progressUpdateRepository.findById(id)
                .map(existingUpdate -> {
                    existingUpdate.setContent(update.getContent());
                    existingUpdate.setUpdateType(update.getUpdateType());
                    existingUpdate.setCompletionPercentage(update.getCompletionPercentage());
                    existingUpdate.setSkillsLearned(update.getSkillsLearned());
                    existingUpdate.setResourcesUsed(update.getResourcesUsed());
                    existingUpdate.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    return ResponseEntity.ok(progressUpdateRepository.save(existingUpdate));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a progress update
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgressUpdate(@PathVariable String id) {
        return progressUpdateRepository.findById(id)
                .map(update -> {
                    progressUpdateRepository.delete(update);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get a single progress update by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdateModel> getProgressUpdate(@PathVariable String id) {
        return progressUpdateRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}