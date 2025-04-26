package backend.Achievements.repository;

import backend.Achievements.model.AchievementsModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AchievementsRepository extends MongoRepository<AchievementsModel, String> {
    void deleteByPostOwnerID(String postOwnerID); // Ensure this method exists
}
