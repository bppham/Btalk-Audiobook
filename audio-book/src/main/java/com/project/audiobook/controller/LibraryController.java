package com.project.audiobook.controller;

import com.project.audiobook.dto.request.LibraryRequest.LibraryRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.LibraryResponse;
import com.project.audiobook.service.LibrarySerivce;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/libraries")
public class LibraryController {
    @Autowired
    private LibrarySerivce librarySerivce;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

    @PostMapping("/save")
    public ApiResponse<LibraryResponse> saveToLibrary(@RequestBody LibraryRequest request, HttpServletRequest httpRequest) {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        LibraryResponse response = librarySerivce.saveToLibrary(userId, request);
        return ApiResponse.<LibraryResponse>builder()
                .result(response)
                .message("Đã thêm vào thư viện")
                .build();
    }

    @PostMapping("/remove")
    public ApiResponse<LibraryResponse> removeFromLibrary(@RequestBody LibraryRequest request, HttpServletRequest httpRequest) {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        LibraryResponse response = librarySerivce.removeFromLibrary(userId, request);
        return ApiResponse.<LibraryResponse>builder()
                .result(response)
                .message("Đã xóa khỏi thư viện")
                .build();
    }

    @GetMapping
    public ApiResponse<List<LibraryResponse>> getUserLibrary(HttpServletRequest httpRequest) {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        List<LibraryResponse> response = librarySerivce.getUserLibrary(userId);
        return ApiResponse.<List<LibraryResponse>>builder()
                .result(response)
                .build();
    }

}
