package com.example.demo.controller;

import com.example.demo.Service.RoleService;
import com.example.demo.entity.Role;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utility.AuthUtils;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/user")
    public ResponseEntity<UserDetails> getUserRole() {
        UserDetails user = AuthUtils.currentUserDetails();
        return ResponseEntity.ok(user);
    }
}