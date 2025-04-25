package com.skilledge.skilledge_backend.controllers;


import com.skilledge.skilledge_backend.models.LearningPlan;
import com.skilledge.skilledge_backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "http://localhost:3000") // Adjust for frontend
public class LearningPlanController {

    @Autowired
    private LearningPlanService service;

    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return service.getAllPlans();
    }

    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        return service.createPlan(plan);
    }
}

