package com.project.audiobook.dto.response.Employee;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String name;
    private String phoneNumber;
    private String email;
    private String password;
    private String avatar;
    private List<Long> roleIds;
    private List<String> roleNames;
}
