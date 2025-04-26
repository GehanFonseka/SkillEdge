package backend.User.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "user")
public class UserModel {
    @Id
    @GeneratedValue
    private String id;
    private String fullname;
    private String email;
    private String password;
    private String phone;
    private String profilePicturePath; // New field for profile picture path
    private String googleProfileImage; // Add this field
    private Set<String> followedUsers = new HashSet<>();
    private Set<String> skills = new HashSet<>(); // Added skills field
    private String bio; // Added bio field

    public UserModel() {}

    public UserModel(String id, String fullname, String email, String password, String phone, String profilePicturePath, String googleProfileImage) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.profilePicturePath = profilePicturePath;
        this.googleProfileImage = googleProfileImage;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfilePicturePath() {
        return profilePicturePath;
    }

    public void setProfilePicturePath(String profilePicturePath) {
        this.profilePicturePath = profilePicturePath;
    }

    public String getGoogleProfileImage() {
        return googleProfileImage;
    }

    public void setGoogleProfileImage(String googleProfileImage) {
        this.googleProfileImage = googleProfileImage;
    }

    public Set<String> getFollowedUsers() {
        return followedUsers;
    }

    public void setFollowedUsers(Set<String> followedUsers) {
        this.followedUsers = followedUsers;
    }

    public Set<String> getSkills() {
        return skills;
    }

    public void setSkills(Set<String> skills) {
        this.skills = skills;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
