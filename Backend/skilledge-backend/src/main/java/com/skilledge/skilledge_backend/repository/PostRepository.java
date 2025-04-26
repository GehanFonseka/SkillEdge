package com.skilledge.skilledge_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skilledge.skilledge_backend.models.Post;

public interface PostRepository extends MongoRepository<Post, String> {
}