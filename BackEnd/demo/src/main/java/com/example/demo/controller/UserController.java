package com.example.demo.controller;

import com.example.demo.Service.UserService;
import com.example.demo.dto.UsersFilter;
import com.example.demo.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //@todo refactoring pageable, filter by username
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/allUsers")
    public ResponseEntity<List<User>> getAllUsers(Pageable pageable, UsersFilter filter) {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }



    @PostMapping("/newUsers")
    public ResponseEntity<String> createUser(@RequestBody User user) {
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

    //@todo refactoring part of GET:/users
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/users/greaterThan/{idMin}")
    public ResponseEntity<List<User>> getUsersWithIdGreaterThan(@PathVariable Long idMin) {
        List<User> users = userService.usergtList(idMin);
        return ResponseEntity.ok(users);
    }
}
