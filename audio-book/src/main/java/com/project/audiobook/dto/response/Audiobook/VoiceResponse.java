package com.project.audiobook.dto.response.Audiobook;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoiceResponse {
    private Long id;
    private String name;
    private int audioBookCount;
}
