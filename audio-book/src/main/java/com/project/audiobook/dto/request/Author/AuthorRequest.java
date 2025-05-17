package com.project.audiobook.dto.request.Author;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorRequest {
    @NotBlank(message = "CATEGORY_BLANK")
    private String name;
}
