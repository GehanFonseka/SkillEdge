package com.skilledge.skilledge_backend.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.skilledge.skilledge_backend.models.User;
import com.skilledge.skilledge_backend.repository.UserRepository;
import com.skilledge.skilledge_backend.security.JwtUtil;
@CrossOrigin(origins = "http://localhost:3001") 
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        // Hash the password before saving
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword().trim()));

        // Log the hashed password to verify
        System.out.println("Hashed Password: " + user.getPassword());

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        // Find the user by username
        User foundUser = userRepository.findByUsername(user.getUsername());

        // Check if user exists
        if (foundUser == null) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        // Log the password comparison (hash comparison)
        System.out.println("Entered Password: " + user.getPassword());
        System.out.println("Stored Hashed Password: " + foundUser.getPassword());

        // Validate password using BCrypt
        boolean passwordMatches = new BCryptPasswordEncoder().matches(user.getPassword().trim(), foundUser.getPassword());

        // Log the result of the password comparison
        System.out.println("Password Matches: " + passwordMatches);

        if (!passwordMatches) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        // Generate JWT token if login is successful
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(token);
    }
    
    @GetMapping("/profile")
public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String token) {
    if (token == null || !token.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
    }

    String jwtToken = token.substring(7); // Remove "Bearer "
    String username = jwtUtil.extractUsername(jwtToken);

    User user = userRepository.findByUsername(username);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    return ResponseEntity.ok(user);
}

@PutMapping("/profile")
public ResponseEntity<String> updateProfile(@RequestHeader("Authorization") String token, @RequestBody User userUpdate) {
    if (token == null || !token.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
    }

    String jwtToken = token.substring(7);
    String username = jwtUtil.extractUsername(jwtToken);

    User foundUser = userRepository.findByUsername(username);
    if (foundUser == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    // Only update allowed fields
    foundUser.setFullName(userUpdate.getFullName());
    foundUser.setBio(userUpdate.getBio());
    foundUser.setLocation(userUpdate.getLocation());
    foundUser.setPhoneNumber(userUpdate.getPhoneNumber());
    foundUser.setProfilePictureUrl(userUpdate.getProfilePictureUrl());

    // Handle password update
    if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
        foundUser.setPassword(new BCryptPasswordEncoder().encode(userUpdate.getPassword().trim()));
    }

    userRepository.save(foundUser);
    return ResponseEntity.ok("Profile updated successfully");
}


@DeleteMapping("/profile")
public ResponseEntity<String> deleteProfile(@RequestHeader("Authorization") String token) {
    if (token == null || !token.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
    }

    String jwtToken = token.substring(7);
    String username = jwtUtil.extractUsername(jwtToken);

    User foundUser = userRepository.findByUsername(username);
    if (foundUser == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    userRepository.delete(foundUser);
    return ResponseEntity.ok("Profile deleted successfully");
}

}