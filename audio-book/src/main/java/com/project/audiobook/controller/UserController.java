package com.project.audiobook.controller;

import com.project.audiobook.dto.request.User.UserUpdationInfoRequest;
import com.project.audiobook.dto.request.User.UserUpdationPasswordRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.User.UserInfoResponse;
import com.project.audiobook.dto.response.User.UserResponse;
import com.project.audiobook.service.UserService;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/user/info")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

    @GetMapping
    ApiResponse<UserInfoResponse> getUserInfo(HttpServletRequest httpRequest) throws IOException {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        return ApiResponse.<UserInfoResponse>builder()
                .result(userService.getUserInfo(userId))
                .build();
    }

    @PutMapping("/update")
    ApiResponse<UserResponse> updateInfo(@RequestBody UserUpdationInfoRequest request, HttpServletRequest httpRequest) throws IOException {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateInfo(userId, request))
                .build();
    }

    @PutMapping("/change-password")
    ApiResponse<UserResponse> changePassword(@RequestBody UserUpdationPasswordRequest request, HttpServletRequest httpRequest) throws IOException {
        Long userId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        return ApiResponse.<UserResponse>builder()
                .result(userService.changePassword(userId, request))
                .build();
    }

}
