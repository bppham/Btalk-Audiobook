package com.project.audiobook.dto.request.Voice;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoiceRequest {
    @NotBlank(message = "VOICE_BLANK")
    private String name;
}
