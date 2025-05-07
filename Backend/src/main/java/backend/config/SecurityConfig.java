package backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .cors().and() // Enable CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/login/**",
                                "/oauth2/**",
                                "/user/**",
                                "/posts/**",
                                "/media/**",
                                "/sendVerificationCode/**",
                                "/uploads/profile/**",
                                "/learningPlan/**",
                                "/achievements/**",
                                "/notifications/**",
                                "/progress-updates/**",
                                "/progress-updates/plan/**",
                                "/progress-updates/user/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/oauth2/success", true)
                );
        return http.build();
    }

        @Bean
        public CorsFilter corsFilter() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowCredentials(true);
                configuration.addAllowedOrigin("http://localhost:3000"); // Allow your frontend URL
                configuration.addAllowedMethod("*"); // Allow all HTTP methods
                configuration.addAllowedHeader("*"); // Allow all headers

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration); // Apply CORS configuration to all paths
                return new CorsFilter(source);
        }
}
