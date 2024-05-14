package com.example.demo.controller;

import com.example.demo.Service.RoleService;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utility.AuthUtils;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @GetMapping("/currentRole")
    public ResponseEntity<Role> getUserRole() {
        User user = AuthUtils.currentUserDetails();
        if (user != null) {
            Role role = user.getRoles().stream().findFirst().orElse(null);
            return ResponseEntity.ok(role);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}