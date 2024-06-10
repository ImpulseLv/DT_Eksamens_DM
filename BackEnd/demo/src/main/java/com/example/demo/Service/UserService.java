package com.example.demo.Service;


import com.example.demo.dto.ChangePasswordDto;
import com.example.demo.dto.CreateUserDto;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {
    @Autowired
    private EntityManager em;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    PasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private RoleService roleService;

    @Transactional
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            User user = userRepository.findByUsername(username);

            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }

            return user;
        }

    public User findUserById(Long userId) {
        Optional<User> userFromDb = userRepository.findById(userId);
        return userFromDb.orElse(new User());
    }
    @Transactional(readOnly = true)
    public List<User> allUsers() {
        return userRepository.findAll();
    }
    @Transactional
    public boolean saveUser(User user) {
        User userFromDB = userRepository.findByUsername(user.getUsername());

        if (userFromDB != null) {
            return false;
        }

        if(user.getRoles() == null || user.getRoles().isEmpty()) {
            Role userRole = roleService.getUserRole();
            user.setRoles(Collections.singleton(userRole));
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }

    public boolean deleteUser(Long userId) {
        if (userRepository.findById(userId).isPresent()) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    public List<User> usergtList(Long idMin) {
        return em.createQuery("SELECT u FROM User u WHERE u.id > :paramId", User.class)
                .setParameter("paramId", idMin).getResultList();
    }

    @Transactional
    public boolean updateUser(Long userId, CreateUserDto dto) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            return false;
        }

        User user = optionalUser.get();
        user.setUsername(dto.getUsername());

        if (!"".equals(dto.getPassword()) || dto.getPassword() != null) {
            user.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
        }
        if(user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }else {
            user.getRoles().clear();
        }
            Role role = roleService.findOrCreateRole(dto.getRoles().toString());
            user.getRoles().add(role);
            userRepository.save(user);
        return true;
    }

    public boolean changePassword(Long userId, ChangePasswordDto dto) {
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            return false;
        }

        return userRepository.findById(userId).map(user -> {
            user.setPassword(bCryptPasswordEncoder.encode(dto.getNewPassword()));
            userRepository.save(user);
            return true;
        }).orElse(false);
    }
}

