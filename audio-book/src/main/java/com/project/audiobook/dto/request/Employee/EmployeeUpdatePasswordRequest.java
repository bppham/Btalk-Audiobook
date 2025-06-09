package com.project.audiobook.dto.request.Employee;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeUpdatePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
