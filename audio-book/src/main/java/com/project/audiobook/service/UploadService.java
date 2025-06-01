package com.project.audiobook.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.audiobook.dto.request.Upload.UploadAudioFilesRequest;
import com.project.audiobook.dto.request.Upload.UploadImageRequest;
import com.project.audiobook.dto.response.Upload.UploadAudioFileResponse;
import com.project.audiobook.dto.response.Upload.UploadImageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class UploadService {
    final Cloudinary cloudinary;

    @Value("${app.default-avatar-url}")
    private String defaultAvatarUrl;

//    public UploadImageResponse uploadImage(UploadImageRequest request) throws IOException {
//        Map<String, Object> options = ObjectUtils.asMap(
//                "folder", request.getFolder()
//        );
//        Map uploadResult = cloudinary.uploader().upload(request.getFile().getBytes(), options);
//        String url = (String) uploadResult.get("secure_url");
//        UploadImageResponse response = new UploadImageResponse();
//        response.setUrl(url);
//        return response;
//    }

    public UploadImageResponse uploadAvatarUser(UploadImageRequest request) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", "audiobook/users/avatars"
        );
        Map uploadResult = cloudinary.uploader().upload(request.getFile().getBytes(), options);
        String url = (String) uploadResult.get("secure_url");
        UploadImageResponse response = new UploadImageResponse();
        response.setUrl(url);
        return response;
    }

    public UploadImageResponse uploadBookCover(UploadImageRequest request) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", "audiobook/covers"
        );
        Map uploadResult = cloudinary.uploader().upload(request.getFile().getBytes(), options);
        String url = (String) uploadResult.get("secure_url");
        UploadImageResponse response = new UploadImageResponse();
        response.setUrl(url);
        return response;
    }

    public List<UploadAudioFileResponse> uploadAudioFiles(UploadAudioFilesRequest request) throws IOException {
        List<UploadAudioFileResponse> responses = new ArrayList<>();

        Map<String, Object> options = ObjectUtils.asMap(
                "folder", "audiobook/audio-files",
                "resource_type", "auto"
        );

        for (int i = 0; i < request.getAudioFiles().size(); i++) {
            MultipartFile file = request.getAudioFiles().get(i);
            String customName = request.getFileNames().get(i);

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            String url = (String) uploadResult.get("secure_url");

            UploadAudioFileResponse response = new UploadAudioFileResponse();
            response.setFileName(customName);
            response.setUrl(url);
            responses.add(response);
        }

        return responses;
    }
}
