package backend.LearningPlan.repository;

import backend.LearningPlan.model.LearningPlanModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LearningPlanRepository extends MongoRepository<LearningPlanModel, String> {
    void deleteByPostOwnerID(String postOwnerID);
    List<LearningPlanModel> findByPostOwnerID(String postOwnerID);
    List<LearningPlanModel> findByPostOwnerName(String postOwnerName); // New method
}
