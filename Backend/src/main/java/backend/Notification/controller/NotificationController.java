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
