package com.project.audiobook.controller;

import com.project.audiobook.dto.request.AudioBook.AudioBookRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.dto.response.Audiobook.UserAudioBookResponse;
import com.project.audiobook.service.AudioBookService;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audiobooks")
public class AudioBookController {
    @Autowired
    private AudioBookService audioBookService;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

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

    @GetMapping("/{id}")
    public ApiResponse<? extends AudioBookResponse> getAudioBookById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        Long userId = null;
        try {
            userId = jwtRequestUtil.getUserIdFromRequest(request);
        } catch (Exception ignored) {
            // Token lỗi hoặc không có, bỏ qua
        }

        if (userId != null) {
            return ApiResponse.<UserAudioBookResponse>builder()
                    .result(audioBookService.getAudioBookByIdForUser(id, userId))
                    .build();
        }

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
