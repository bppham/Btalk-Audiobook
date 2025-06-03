package com.project.audiobook.controller;

import com.project.audiobook.dto.request.Like.LikeRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.LikeResponse;
import com.project.audiobook.service.LikeService;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

    @PostMapping
    ApiResponse<LikeResponse> toggleLike(@RequestBody LikeRequest request, HttpServletRequest httpRequest) {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        return ApiResponse.<LikeResponse>builder()
                .result(likeService.toggleLike(userId ,request))
                .build();
    }
}
