package com.project.audiobook.controller;

import com.project.audiobook.dto.request.Upload.UploadAudioFilesRequest;
import com.project.audiobook.dto.request.Upload.UploadImageRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Upload.UploadAudioFileResponse;
import com.project.audiobook.dto.response.Upload.UploadImageResponse;
import com.project.audiobook.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/upload")
public class UploadController {

    @Autowired
    private UploadService uploadService;

    @PostMapping("/user/avatar")
    ApiResponse<UploadImageResponse> uploadUserAvatar(@ModelAttribute UploadImageRequest request) throws IOException {
        return ApiResponse.<UploadImageResponse>builder()
                .result(uploadService.uploadAvatarUser(request))
                .build();
    }

    @PostMapping("/audiobook/cover")
    ApiResponse<UploadImageResponse> uploadAudiobookCover(@ModelAttribute UploadImageRequest request) throws IOException {
        return ApiResponse.<UploadImageResponse>builder()
                .result(uploadService.uploadBookCover(request))
                .build();
    }

    @PostMapping("/audiobook/audio-files")
    ApiResponse<List<UploadAudioFileResponse>> uploadMultipleAudio(@ModelAttribute UploadAudioFilesRequest request) throws IOException {
        return ApiResponse.<List<UploadAudioFileResponse>>builder()
                .result(uploadService.uploadAudioFiles(request))
                .build();
    }

}
