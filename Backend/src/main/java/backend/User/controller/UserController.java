package backend.User.controller;

import backend.exception.ResourceNotFoundException;
import backend.Notification.model.NotificationModel;
import backend.User.model.UserModel;
import backend.LearningPlan.model.LearningPlanModel; // Import LearningPlanModel
import backend.Notification.repository.NotificationRepository;
import backend.User.repository.UserRepository;
import backend.Achievements.repository.AchievementsRepository; // Import the repository
import backend.LearningPlan.repository.LearningPlanRepository; // Import the repository
import backend.PostManagement.repository.PostManagementRepository; // Import the repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AchievementsRepository achievementsRepository; // Inject the repository

    @Autowired
    private LearningPlanRepository learningPlanRepository; // Inject the repository

    @Autowired
    private PostManagementRepository postManagementRepository; // Inject the repository

    @Autowired
    private JavaMailSender mailSender; // Add JavaMailSender for sending emails

    private static final String PROFILE_UPLOAD_DIR = "uploads/profile"; // Relative path

    //Insert
    @PostMapping("/user")
    public ResponseEntity<?> newUserModel(@RequestBody UserModel newUserModel) {
        if (newUserModel.getEmail() == null || newUserModel.getFullname() == null || 
            newUserModel.getPassword() == null || newUserModel.getBio() == null || // Validate bio
            newUserModel.getSkills() == null) { // Validate skills
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Missing required fields."));
        }

        if (userRepository.existsByEmail(newUserModel.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already exists!"));
        }

        try {
            UserModel savedUser = userRepository.save(newUserModel);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to save user."));
        }
    }

    //User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserModel loginDetails) {
        System.out.println("Login attempt for email: " + loginDetails.getEmail()); // Log email for debugging

        UserModel user = userRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Email not found: " + loginDetails.getEmail()));

        if (user.getPassword().equals(loginDetails.getPassword())) {
            System.out.println("Login successful for email: " + loginDetails.getEmail()); // Log success
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login Successful");
            response.put("id", user.getId());
            response.put("fullName", user.getFullname());
            return ResponseEntity.ok(response);
        } else {
            System.out.println("Invalid password for email: " + loginDetails.getEmail()); // Log invalid password
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials!"));
        }
    }

    //Display
    @GetMapping("/user")
    List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    UserModel getUserId(@PathVariable String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    //update
    @PutMapping("/user/{id}")
    UserModel updateProfile(@RequestBody UserModel newUserModel, @PathVariable String id) {
        return userRepository.findById(id)
                .map(userModel -> {
                    userModel.setFullname(newUserModel.getFullname());
                    userModel.setEmail(newUserModel.getEmail());
                    userModel.setPassword(newUserModel.getPassword());
                    userModel.setPhone(newUserModel.getPhone());
                    userModel.setProfilePicturePath(newUserModel.getProfilePicturePath());
                    userModel.setSkills(newUserModel.getSkills()); // Update skills
                    userModel.setBio(newUserModel.getBio()); // Update bio
                    
                    // Update postOwnerName in all related posts
                    List<LearningPlanModel> userPosts = learningPlanRepository.findByPostOwnerID(id);
                    userPosts.forEach(post -> {
                        post.setPostOwnerName(newUserModel.getFullname());
                        learningPlanRepository.save(post);
                    });
                    
                    return userRepository.save(userModel);
                }).orElseThrow(() -> new ResourceNotFoundException(id));
    }

    @PutMapping("/user/{id}/uploadProfilePicture")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return userRepository.findById(id).map(user -> {
            try {
                // Resolve the upload directory as an absolute path
                File uploadDir = new File(System.getProperty("user.dir"), PROFILE_UPLOAD_DIR);

                // Ensure the upload directory exists
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // Generate a unique file name
                String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
                String uniqueFileName = System.currentTimeMillis() + "_" + UUID.randomUUID() + "." + extension;

                // Save the file to the upload directory
                Path filePath = uploadDir.toPath().resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath);

                // Save only the file name in the database
                user.setProfilePicturePath(uniqueFileName);
                userRepository.save(user);

                return ResponseEntity.ok(Map.of("message", "Profile picture uploaded successfully."));
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to upload profile picture."));
            }
        }).orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @GetMapping("/uploads/profile/{fileName}")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String fileName) {
        try {
            // Resolve the upload directory as an absolute path
            File uploadDir = new File(System.getProperty("user.dir"), PROFILE_UPLOAD_DIR);
            Path filePath = uploadDir.toPath().resolve(fileName);

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //delete
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }

        // Delete user-related data
        userRepository.findById(id).ifPresent(user -> {
            // Delete user's posts
            achievementsRepository.deleteByPostOwnerID(id);
            learningPlanRepository.deleteByPostOwnerID(id);
            postManagementRepository.deleteByUserID(id); // Delete user's posts
            notificationRepository.deleteByUserId(id);

            // Remove user from followers and following lists
            userRepository.findAll().forEach(otherUser -> {
                otherUser.getFollowedUsers().remove(id);
                userRepository.save(otherUser);
            });
        });

        // Delete the user account
        userRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "User account and related data deleted successfully."));
    }

    // check email
    @GetMapping("/checkEmail")
    public boolean checkEmailExists(@RequestParam String email) {
        return userRepository.existsByEmail(email);
    }

    @PutMapping("/user/{userID}/follow")
    public ResponseEntity<?> followUser(@PathVariable String userID, @RequestBody Map<String, String> request) {
        String followUserID = request.get("followUserID");
        return userRepository.findById(userID).map(user -> {
            user.getFollowedUsers().add(followUserID);
            userRepository.save(user);

            // Create a notification for the followed user
            String followerFullName = userRepository.findById(userID)
                    .map(follower -> follower.getFullname())
                    .orElse("Someone");
            String message = String.format("%s started following you.", followerFullName);
            String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            NotificationModel notification = new NotificationModel(followUserID, message, false, currentDateTime);
            notificationRepository.save(notification);

            return ResponseEntity.ok(Map.of("message", "User followed successfully"));
        }).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userID));
    }

    @PutMapping("/user/{userID}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String userID, @RequestBody Map<String, String> request) {
        String unfollowUserID = request.get("unfollowUserID");
        return userRepository.findById(userID).map(user -> {
            user.getFollowedUsers().remove(unfollowUserID);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User unfollowed successfully"));
        }).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userID));
    }

    @GetMapping("/user/{userID}/followedUsers")
    public List<String> getFollowedUsers(@PathVariable String userID) {
        return userRepository.findById(userID)
                .map(user -> new ArrayList<>(user.getFollowedUsers())) // Convert Set to List
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userID));
    }

    @PostMapping("/sendVerificationCode")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        if (email == null || code == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email and code are required."));
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your Verification Code");
            message.setText("Your verification code is: " + code);
            mailSender.send(message);

            return ResponseEntity.ok(Map.of("message", "Verification code sent successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to send verification code."));
        }
    }
}
