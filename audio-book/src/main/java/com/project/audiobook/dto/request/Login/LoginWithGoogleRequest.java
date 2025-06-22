package com.project.audiobook.dto.request.Login;

import com.project.audiobook.enums.DeviceType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginWithGoogleRequest {
    private String idToken;
    private String name;
    private String photoURL;
    private DeviceType deviceType = DeviceType.WEB;;
}
