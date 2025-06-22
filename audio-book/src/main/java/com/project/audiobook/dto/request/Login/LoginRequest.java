package com.project.audiobook.dto.request.Login;

import com.project.audiobook.enums.DeviceType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    private String email;
    private String password;
    private DeviceType deviceType;
}
