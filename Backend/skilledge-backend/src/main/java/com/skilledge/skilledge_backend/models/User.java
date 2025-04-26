package com.skilledge.skilledge_backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String fullName;  // New field for full name
    private String bio;       // New field for bio
    private String location;  // New field for location
    private String phoneNumber; // New field for phone number
    private String profilePictureUrl; // New field for profile picture URL
}
