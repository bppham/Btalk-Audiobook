package com.project.audiobook.controller;

import com.project.audiobook.dto.request.Rating.RatingRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Audiobook.RatingResponse;
import com.project.audiobook.service.RatingSerivce;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingSerivce ratingSerivce;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

    @PostMapping
    ApiResponse<RatingResponse> rateAudioBook(@RequestBody RatingRequest request, HttpServletRequest httpRequest) {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        return ApiResponse.<RatingResponse>builder()
                .result(ratingSerivce.rateAudioBook(userId ,request))
                .build();
    }
}
