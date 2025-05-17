package com.project.audiobook.dto.request.Employee;

import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeCreationRequest {
    private String name;
    private String phoneNumber;
    private String email;
    private String password;
    private String avatar;
    private List<Long> roleIds;
}
