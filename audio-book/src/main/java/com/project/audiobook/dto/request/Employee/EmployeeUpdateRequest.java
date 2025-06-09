package com.project.audiobook.dto.request.Employee;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeUpdateRequest {
    private String name;
    private String phoneNumber;
    private String email;
    private String avatar;
    private List<Long> roleIds;
}
