package com.project.audiobook.controller;

import com.project.audiobook.dto.request.ForgetPassword.ForgetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.ResetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.VerifyCodeRequest;
import com.project.audiobook.dto.request.Login.LoginRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Auth.ForgetPasswordResponse;
import com.project.audiobook.dto.response.Auth.LoginResponse;
import com.project.audiobook.dto.response.Auth.ResetPasswordResponse;
import com.project.audiobook.dto.response.Auth.VerifyCodeResponse;
import com.project.audiobook.service.AdminAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/auth")
public class AdminAuthController {
    @Autowired
    AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(adminAuthService.login(request));
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
}
