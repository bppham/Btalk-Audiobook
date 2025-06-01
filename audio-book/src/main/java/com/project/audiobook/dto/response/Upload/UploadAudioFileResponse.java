package com.project.audiobook.dto.response.Upload;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadAudioFileResponse {
    private String fileName;
    private String url;
}
