package com.example.demo.controller;

import com.example.demo.Service.RoleService;
import com.example.demo.Service.UserService;
import com.example.demo.dto.ChangePasswordDto;
import com.example.demo.dto.CreateUserDto;
import com.example.demo.dto.UsersFilter;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final RoleService roleService;
    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    //@todo refactoring pageable, filter by username
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/allUsers")
    public ResponseEntity<List<User>> getAllUsers(Pageable pageable, UsersFilter filter) {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }


    @Transactional
    @PostMapping("/newUsers")
    public ResponseEntity<String> createUser(@RequestBody CreateUserDto dto) {
        String roleName = dto.getRoles() == null || dto.getRoles().isEmpty()?"USER":dto.getRoles();
        Role role = roleService.findOrCreateRole(roleName);
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setRoles(Collections.singleton(role));
        boolean created = userService.saveUser(user);
        if (created) {
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with this username already exists");
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.findUserById(userId);
        if (user.getId() != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long userId) {
        boolean deleted = userService.deleteUser(userId);
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found or could not be deleted");
        }
    }
    
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/users/greaterThan/{idMin}")
    public ResponseEntity<List<User>> getUsersWithIdGreaterThan(@PathVariable Long idMin) {
        List<User> users = userService.usergtList(idMin);
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PutMapping("/users/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable Long userId, @RequestBody CreateUserDto dto) {
        boolean updated = userService.updateUser(userId, dto);
        if (updated) {
            return ResponseEntity.ok("User updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR', 'USER')")
    @PutMapping("/users/{userId}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordDto dto) {
        boolean updated = userService.changePassword(userId, dto);
        if (updated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or password update failed");
        }
    }

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        try {
            User currentUser = (User) userService.loadUserByUsername(currentUsername);
            return ResponseEntity.ok(currentUser);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
