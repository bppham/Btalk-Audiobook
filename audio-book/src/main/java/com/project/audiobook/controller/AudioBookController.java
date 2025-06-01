package com.project.audiobook.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.audiobook.dto.request.AudioBook.AudioBookRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.service.AudioBookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/audiobooks")
public class AudioBookController {
    @Autowired
    private AudioBookService audioBookService;

    @PostMapping
    ApiResponse<AudioBookResponse> createAudioBook(@RequestBody AudioBookRequest request) {
        return ApiResponse.<AudioBookResponse>builder()
                .result(audioBookService.createRequest(request))
                .build();
    }

    @PutMapping(value = "/{id}")
    ApiResponse<AudioBookResponse> updateAudioBook(@Valid
            @PathVariable Long id, @RequestBody AudioBookRequest request) {
        return ApiResponse.<AudioBookResponse>builder()
                .result(audioBookService.updateAudioBook(id, request))
                .build();
    }

    @DeleteMapping(value = "/{id}")
    public ApiResponse<String> deleteAudioBook(@PathVariable Long id) {
        audioBookService.deleteAudioBook(id);
        return ApiResponse.<String>builder().result("Audio book has been deleted").build();
    }

    @GetMapping(value = "/{id}")
    ApiResponse<AudioBookResponse> getAudioBookById(@PathVariable Long id){
        return ApiResponse.<AudioBookResponse>builder()
                .result(audioBookService.getAudioBookById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<AudioBookResponse>> getAllAudioBook() {
        return ApiResponse.<List<AudioBookResponse>>builder()
                .result(audioBookService.getAllAudioBooks())
                .build();
    }
}
