package com.project.audiobook.dto.request.Like;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikeRequest {
    private Long audioBookId;
}
