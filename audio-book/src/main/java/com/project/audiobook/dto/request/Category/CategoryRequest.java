package com.project.audiobook.dto.request.Category;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {
    @NotBlank(message = "CATEGORY_BLANK111")
    private String name;
}
