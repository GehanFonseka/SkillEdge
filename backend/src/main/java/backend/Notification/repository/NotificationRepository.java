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
// Update 14 - 2025-03-30 - Improved notification system
// Update 18 - 2025-04-03 - Improved notification system
// Update 20 - 2025-04-05 - Improved notification system
// Update 0 - 2025-03-16 - Improved notification system
// Update 4 - 2025-03-20 - Improved notification system
// Update 9 - 2025-03-25 - Improved notification system
// Update 13 - 2025-03-29 - Improved notification system
// Update 15 - 2025-03-31 - Improved notification system
// Update 19 - 2025-04-04 - Improved notification system
// Update 22 - 2025-04-07 - Improved notification system
