package com.project.audiobook.dto.request.Login;

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
}
