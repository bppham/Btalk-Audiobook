package com.project.audiobook.dto.request.User;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdationInfoRequest {
    @NotBlank(message = "NAME_BLANK")
    private String name;
    private String photoURL;
}
