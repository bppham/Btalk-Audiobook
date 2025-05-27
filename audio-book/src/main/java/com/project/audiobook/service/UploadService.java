package com.project.audiobook.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.audiobook.dto.request.Upload.UploadImageRequest;
import com.project.audiobook.dto.response.Upload.UploadImageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class UploadService {
    final Cloudinary cloudinary;

    @Value("${app.default-avatar-url}")
    private String defaultAvatarUrl;

    public UploadImageResponse uploadImage(UploadImageRequest request) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", request.getFolder()
        );
        Map uploadResult = cloudinary.uploader().upload(request.getFile().getBytes(), options);
        String url = (String) uploadResult.get("secure_url");
        UploadImageResponse response = new UploadImageResponse();
        response.setUrl(url);
        return response;
    }

//    public String uploadAudio(MultipartFile file, String folder) throws IOException {
//        Map<String, Object> options = ObjectUtils.asMap(
//                "folder", folder,
//                "resource_type", "auto" // Cloudinary sẽ tự hiểu là audio
//        );
//        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
//        return (String) uploadResult.get("secure_url");
//    }

    public String getDefaultAvatarUrl() {
        return defaultAvatarUrl;
    }

}
