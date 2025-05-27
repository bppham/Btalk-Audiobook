package com.project.audiobook.controller;

import com.project.audiobook.dto.request.Upload.UploadImageRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Upload.UploadImageResponse;
import com.project.audiobook.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/upload")
public class UploadController {

    @Autowired
    private UploadService uploadService;

    @PostMapping("/user/avatar")
    ApiResponse<UploadImageResponse> uploadUserAvatar(@ModelAttribute UploadImageRequest request) throws IOException {
        return ApiResponse.<UploadImageResponse>builder()
                .result(uploadService.uploadImage(request))
                .build();
    }


}
