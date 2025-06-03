package com.project.audiobook.dto.response.Audiobook;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LibraryResponse {
    private Long audioBookId;
    private String title;
    private String image;
    private LocalDateTime savedAt;
}
