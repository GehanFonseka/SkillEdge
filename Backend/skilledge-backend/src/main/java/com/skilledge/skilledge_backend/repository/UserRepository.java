package com.skilledge.skilledge_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skilledge.skilledge_backend.models.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}
