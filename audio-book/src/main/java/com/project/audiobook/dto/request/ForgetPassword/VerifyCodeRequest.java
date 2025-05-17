package com.project.audiobook.dto.request.ForgetPassword;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyCodeRequest {
    private String email;
    private String code;
}
