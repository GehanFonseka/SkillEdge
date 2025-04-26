package com.skilledge.skilledge_backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class StorageService {

    private final Path rootLocation = Paths.get("uploads"); // Save in "uploads" folder

    public StorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public String store(MultipartFile file) {
        try {
            String uniqueFilename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destinationFile = rootLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), destinationFile);
            return uniqueFilename; // Return stored filename
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
