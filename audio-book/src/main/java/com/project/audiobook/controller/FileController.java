package com.project.audiobook.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/files")
public class FileController {
    private final Path uploadDirAudiobook = Paths.get("uploads/audiobooks").toAbsolutePath().normalize();
    private final Path uploadDirAvatar = Paths.get("uploads/avatars").toAbsolutePath().normalize();

    @GetMapping("/{title}/{type}/{fileName:.+}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String title,
            @PathVariable String type,
            @PathVariable String fileName) {
        try {
            // Xác định đường dẫn file theo title và loại file (image/audio)
            Path filePath = uploadDirAudiobook.resolve(title.replace(" ", "_")).resolve(type).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Xác định loại file động
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream"; // Default nếu không xác định được
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getFile(
            @PathVariable String fileName) {
        try {
            // Xác định đường dẫn file theo title và loại file (image/audio)
            Path filePath = uploadDirAvatar.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Xác định loại file động
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream"; // Default nếu không xác định được
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
