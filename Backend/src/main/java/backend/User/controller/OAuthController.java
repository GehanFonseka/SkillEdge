package backend.User.controller;

import backend.User.model.UserModel;
import backend.User.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
public class OAuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/oauth2/success")
    public RedirectView handleGoogleLogin(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String googleProfileImage = (String) attributes.get("picture"); // Retrieve Google profile image URL

        // Encode the Google profile image URL
        String encodedGoogleProfileImage = URLEncoder.encode(googleProfileImage, StandardCharsets.UTF_8);

        UserModel user;
        // Check if user already exists
        if (!userRepository.existsByEmail(email)) {
            user = new UserModel();
            user.setEmail(email);
            user.setFullname(name);
            user.setGoogleProfileImage(googleProfileImage); // Save Google profile image
            userRepository.save(user);
        } else {
            user = userRepository.findByEmail(email).orElseThrow(() -> 
                new IllegalStateException("User not found despite existence check"));
        }

        String redirectUrl = String.format(
            "http://localhost:3000/oauth2/success?userID=%s&name=%s&googleProfileImage=%s",
            user.getId().toString(),
            user.getFullname(),
            encodedGoogleProfileImage // Use the encoded URL
        );

        return new RedirectView(redirectUrl);
    }
}
