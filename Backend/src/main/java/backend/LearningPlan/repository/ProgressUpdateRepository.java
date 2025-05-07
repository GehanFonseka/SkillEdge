package backend.LearningPlan.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import backend.LearningPlan.model.ProgressUpdateModel;

public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdateModel, String> {
    List<ProgressUpdateModel> findByLearningPlanId(String learningPlanId);
    List<ProgressUpdateModel> findByUserId(String userId);
}