package com.skilledge.skilledge_backend.repository;


import com.skilledge.skilledge_backend.models.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningPlanRepository extends MongoRepository<LearningPlan, Long> {
}

