package com.project.audiobook.dto.request.User;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdatePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
