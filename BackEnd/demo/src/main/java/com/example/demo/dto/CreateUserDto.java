package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class CreateUserDto {
  private String username;
  private String password;
  private String roles;
}
