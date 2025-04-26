package com.skilledge.skilledge_backend.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.skilledge.skilledge_backend.models.Post;
import com.skilledge.skilledge_backend.repository.PostRepository;
import com.skilledge.skilledge_backend.services.StorageService;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class PostController {
    private final PostRepository postRepository;
    private final StorageService storageService; // Add this for file handling

    public PostController(PostRepository postRepository, StorageService storageService) {
        this.postRepository = postRepository;
        this.storageService = storageService;
    }

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);
    
        List<String> mediaUrls = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                try {
                    String fileUrl = storageService.store(file);
                    mediaUrls.add("/uploads/" + fileUrl); // Save URL for frontend
                } catch (Exception e) {
                    System.err.println("File upload failed: " + e.getMessage());
                }
            }
        }
        post.setMediaUrls(mediaUrls);
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }
    
    // Get all posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return ResponseEntity.ok(posts);
    }

    // Get a post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a post by ID
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        return postRepository.findById(id).map(post -> {
            post.setTitle(updatedPost.getTitle());
            post.setDescription(updatedPost.getDescription());
            post.setMediaUrls(updatedPost.getMediaUrls());
            Post savedPost = postRepository.save(post);
            return ResponseEntity.ok(savedPost);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a post by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Like a post
    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id) {
        return postRepository.findById(id).map(post -> {
            post.setLikes(post.getLikes() + 1);
            Post savedPost = postRepository.save(post);
            return ResponseEntity.ok(savedPost);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Add a comment to a post
    @PostMapping("/{id}/comment")
    public ResponseEntity<Post> addComment(@PathVariable String id, @RequestBody String comment) {
        return postRepository.findById(id).map(post -> {
            post.getComments().add(comment);
            Post savedPost = postRepository.save(post);
            return ResponseEntity.ok(savedPost);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}