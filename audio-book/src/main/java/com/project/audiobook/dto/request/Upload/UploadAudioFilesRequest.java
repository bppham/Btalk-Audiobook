package com.project.audiobook.dto.request.Upload;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadAudioFilesRequest {
    private List<MultipartFile> audioFiles;
    private List<String> fileNames;
}
