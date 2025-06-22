package com.project.audiobook.controller;

import com.project.audiobook.dto.request.ForgetPassword.ForgetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.ResetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.VerifyCodeRequest;
import com.project.audiobook.dto.request.Login.LoginRequest;
import com.project.audiobook.dto.request.Login.RefreshTokenRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Auth.*;
import com.project.audiobook.service.AdminAuthService;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/auth")
public class AdminAuthController {
    @Autowired
    AdminAuthService adminAuthService;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

    @PostMapping("/login")
    ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.<LoginResponse>builder()
                .result(adminAuthService.login(request))
                .build();
    }

    @PostMapping("/forget-password")
    ApiResponse<ForgetPasswordResponse> forgetPassword(@RequestBody ForgetPasswordRequest request) {
        return ApiResponse.<ForgetPasswordResponse>builder()
                .result(adminAuthService.forgetPassword(request))
                .build();
    }

    @PostMapping("/verify-code")
    ApiResponse<VerifyCodeResponse> verifyCode(@RequestBody VerifyCodeRequest request) {
        return ApiResponse.<VerifyCodeResponse>builder()
                .result(adminAuthService.verifyCode(request))
                .build();
    }

    @PutMapping("/reset-password")
    ApiResponse<ResetPasswordResponse> resetPassword (@RequestBody ResetPasswordRequest request) {
        return ApiResponse.<ResetPasswordResponse>builder()
                .result(adminAuthService.resetPassword(request))
                .build();
    }
    @PostMapping("/refresh")
    ApiResponse<RefreshTokenResponse> refreshToken (@RequestBody RefreshTokenRequest request) {
        return ApiResponse.<RefreshTokenResponse>builder()
                .result(adminAuthService.refreshToken(request))
                .build();
    }
    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpServletRequest httpRequest, @RequestBody RefreshTokenRequest request) {
        String accessToken = jwtRequestUtil.extractAccessToken(httpRequest);
        adminAuthService.logout(accessToken, request);
        return ApiResponse.<String>builder()
                .result("Logged out successfully")
                .build();
    }
}
