package com.skilledge.skilledge_backend.service;

import com.skilledge.skilledge_backend.models.LearningPlan;
import com.skilledge.skilledge_backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository repository;

    public List<LearningPlan> getAllPlans() {
        return repository.findAll();
    }

    public LearningPlan createPlan(LearningPlan plan) {
        return repository.save(plan);
    }
}

