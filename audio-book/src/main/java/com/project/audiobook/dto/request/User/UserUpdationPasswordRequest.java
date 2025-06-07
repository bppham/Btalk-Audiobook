package com.project.audiobook.dto.request.User;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdationPasswordRequest {
    private String oldPassword;
    private String newPassword;
}
