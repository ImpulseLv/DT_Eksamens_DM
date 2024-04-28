package com.example.demo.Service;

import com.example.demo.entity.Role;
import com.example.demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;
    private Role findOrCreateRole(String roleName) {
        Role existingRole = roleRepository.findByName(roleName);

        if (existingRole != null) {
            return existingRole;
        } else {
            Role newRole = new Role();
            newRole.setName(roleName);
            newRole = roleRepository.save(newRole);
            return newRole;
        }

    }
    public Role getAdminRole() {
        return findOrCreateRole("ADMIN");
    }
    public Role getModeratorRole() {
        return findOrCreateRole("MODERATOR");
    }
    public Role getUserRole() {
        return findOrCreateRole("USER");
    }
}
