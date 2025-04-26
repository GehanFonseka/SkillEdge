package backend.PostManagement.repository;

import backend.PostManagement.model.PostManagementModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostManagementRepository extends MongoRepository<PostManagementModel, String> {
    void deleteByUserID(String userID); // Ensure this method exists
}
