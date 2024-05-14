package com.example.demo.configurations;

import com.example.demo.Service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


import java.io.IOException;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class WebSecurity {

    @Autowired
    UserService userService;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Collections.singletonList("*"));
        config.setAllowedMethods(Collections.singletonList("*"));
        config.setAllowedHeaders(Collections.singletonList("*"));
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
        @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http ,AuthenticationManager authenticationManager) throws Exception {
       CustomFilter mupaf = new CustomFilter();
      mupaf.setAuthenticationManager(authenticationManager);

        http
                .csrf()
                .disable()
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authenticationManager(authenticationManager)
                .addFilterAt(
                        mupaf,
                        UsernamePasswordAuthenticationFilter.class)
                .httpBasic().disable()
                //@todo refactoring
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/registration1").hasRole("A")
                        .anyRequest().permitAll()
                )
                //.formLogin(formLogin -> formLogin.successHandler(new AuthenticationSuccessHandler() {
                  //          @Override
                  //          public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

                     //       }
                   //     })
                    //    .successForwardUrl("/abcd"))

                .logout((logout) -> logout
                        .permitAll()
                        .logoutSuccessUrl("/"))
                            .sessionManagement()
                                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS);


        return http.build();
    }

}


