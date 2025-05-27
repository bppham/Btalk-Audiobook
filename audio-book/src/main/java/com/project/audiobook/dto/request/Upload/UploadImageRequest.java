package com.project.audiobook.dto.request.Upload;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadImageRequest {
    private MultipartFile file;
    private String folder;
}
