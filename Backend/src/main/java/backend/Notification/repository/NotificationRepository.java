package backend.Notification.repository;

import backend.Notification.model.NotificationModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<NotificationModel, String> {
    List<NotificationModel> findByUserId(String userId);
    List<NotificationModel> findByUserIdAndReadFalse(String userId);
    void deleteByUserId(String userId);
}
// Update 14 - 2025-03-30 - Improved notification system
// Update 26 - 2025-04-11 - Improved notification system
// Update 0 - 2025-04-24 - Improved notification system
// Update 2 - 2025-04-24 - Improved notification system
