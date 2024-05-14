package com.example.demo.controller;

import com.example.demo.Service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

//@todo refactoring delete?
@Controller
@RestController("/admin")
public class AdminController {
    private UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/userList")
    public String userList(ModelMap model) {
        model.addAttribute("allUsers", userService.allUsers());
        return "admin";
    }
    @PostMapping("/delUser")
    public String  deleteUser(@RequestParam(required = true, defaultValue = "" ) Long userId,
                              @RequestParam(required = true, defaultValue = "" ) String action,
                              ModelMap model) {
        if (action.equals("delete")){
            userService.deleteUser(userId);
        }
        return "redirect:/admin";
    }
    @GetMapping("/admin/{userId}")
    public String  gtUser(@PathVariable("userId") Long userId, ModelMap model) {
        model.addAttribute("allUsers", userService.usergtList(userId));
        return "admin";
    }
}
