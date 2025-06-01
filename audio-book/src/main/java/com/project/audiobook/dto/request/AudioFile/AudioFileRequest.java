package com.project.audiobook.dto.request.AudioFile;

import com.project.audiobook.entity.AudioBook;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioFileRequest {
    private String fileName;
    private String fileUrl;
}
