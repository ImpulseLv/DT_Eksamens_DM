package com.example.demo.controller;

import com.example.demo.Service.UserService;
import com.example.demo.entity.User;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/reg")
public class RegistrationController {
    private UserService userService;

    @GetMapping("/")
    public String getIndex(){
        return "index.html";
    }

    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/registration1")
    public String registration(ModelMap model) {
        model.addAttribute("userForm", new User());

        return "registration1";
    }
    @PostMapping("/registration1")
    public String addUser(@ModelAttribute("userForm") @Valid User userForm, BindingResult bindingResult, ModelMap model){
        if (bindingResult.hasErrors()) {
            return "registration1";
        }
        if (!userForm.getPassword().equals(userForm.getPasswordConfirm())){
            model.addAttribute("passwordError", "Пароли не совпадают");
            return "registration1";
        }
        if (!userService.saveUser(userForm)){
            model.addAttribute("usernameError", "Пользователь с таким именем уже существует");
            return "registration1";
        }
        return "redirect:/";
    }
}
