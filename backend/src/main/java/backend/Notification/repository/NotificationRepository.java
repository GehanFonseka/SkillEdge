package backend.Notification.repository;

import backend.Notification.model.NotificationModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<NotificationModel, String> {
    List<NotificationModel> findByUserId(String userId);
    void deleteByUserId(String userId);
}
// Update 0 - 2025-03-16 - Improved notification system
// Update 10 - 2025-03-26 - Improved notification system
// Update 13 - 2025-03-29 - Improved notification system
// Update 16 - 2025-04-01 - Improved notification system
// Update 17 - 2025-04-02 - Improved notification system
// Update 1 - 2025-03-17 - Improved notification system
// Update 5 - 2025-03-21 - Improved notification system
// Update 7 - 2025-03-23 - Improved notification system
