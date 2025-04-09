package backend.Notification.controller;

import backend.Notification.model.NotificationModel;
import backend.Notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin("http://localhost:3000")
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/{userId}")
    public List<NotificationModel> getNotifications(@PathVariable String userId) {
        return notificationRepository.findByUserId(userId);
    }

    @PutMapping("/{id}/markAsRead")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        return notificationRepository.findById(id).map(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok("Notification marked as read");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return ResponseEntity.ok("Notification deleted");
        }
        return ResponseEntity.notFound().build();
    }
}
// Update 7 - 2025-03-23 - Improved notification system
// Update 8 - 2025-03-24 - Improved notification system
// Update 11 - 2025-03-27 - Improved notification system
// Update 25 - 2025-04-10 - Improved notification system
// Update 15 - 2025-03-31 - Improved notification system
// Update 24 - 2025-04-09 - Improved notification system
// Update 25 - 2025-04-10 - Improved notification system
// Update 27 - 2025-04-12 - Improved notification system
// Update 1 - 2025-03-17 - Improved notification system
// Update 2 - 2025-03-18 - Improved notification system
// Update 5 - 2025-03-21 - Improved notification system
// Update 7 - 2025-03-23 - Improved notification system
// Update 11 - 2025-03-27 - Improved notification system
// Update 12 - 2025-03-28 - Improved notification system
// Update 17 - 2025-04-02 - Improved notification system
// Update 21 - 2025-04-06 - Improved notification system
// Update 24 - 2025-04-09 - Improved notification system
