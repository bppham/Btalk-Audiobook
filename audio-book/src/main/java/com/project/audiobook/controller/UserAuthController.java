package com.project.audiobook.controller;

import com.project.audiobook.dto.request.ForgetPassword.ForgetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.ResetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.VerifyCodeRequest;
import com.project.audiobook.dto.request.Login.LoginRequest;
import com.project.audiobook.dto.request.Login.LoginWithGoogleRequest;
import com.project.audiobook.dto.request.Login.RefreshTokenRequest;
import com.project.audiobook.dto.request.Login.RegisterRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Auth.*;
import com.project.audiobook.dto.response.User.UserResponse;
import com.project.audiobook.service.UserAuthService;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/user/auth")
public class UserAuthController {
    @Autowired
    UserAuthService userAuthService;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

    @PostMapping("/register")
    ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) throws IOException {
        return ApiResponse.<UserResponse>builder()
                .result(userAuthService.registerUser(request))
                .build();
    }

    @PostMapping("/login")
    ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.<LoginResponse>builder()
                .result(userAuthService.login(request))
                .build();
    }

    @PostMapping("/loginWithGoogle")
    ApiResponse<LoginResponse> loginWithGoogle(@RequestBody LoginWithGoogleRequest request) {
        return ApiResponse.<LoginResponse>builder()
                .result(userAuthService.loginWithGoogle(request))
                .build();
    }

    @PostMapping("/forget-password")
    ApiResponse<ForgetPasswordResponse> forgetPassword(@RequestBody ForgetPasswordRequest request) {
        return ApiResponse.<ForgetPasswordResponse>builder()
                .result(userAuthService.forgetPassword(request))
                .build();
    }

    @PostMapping("/verify-code")
    ApiResponse<VerifyCodeResponse> verifyCode(@RequestBody VerifyCodeRequest request) {
        return ApiResponse.<VerifyCodeResponse>builder()
                .result(userAuthService.verifyCode(request))
                .build();
    }

    @PutMapping("/reset-password")
    ApiResponse<ResetPasswordResponse> resetPassword (@RequestBody ResetPasswordRequest request) {
        return ApiResponse.<ResetPasswordResponse>builder()
                .result(userAuthService.resetPassword(request))
                .build();
    }
    @PostMapping("/refresh")
    ApiResponse<RefreshTokenResponse> refreshToken (@RequestBody RefreshTokenRequest request) {
        return ApiResponse.<RefreshTokenResponse>builder()
                .result(userAuthService.refreshToken(request))
                .build();
    }
    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpServletRequest httpRequest, @RequestBody RefreshTokenRequest request) {
        String accessToken = jwtRequestUtil.extractAccessToken(httpRequest);
        userAuthService.logout(accessToken, request);
        return ApiResponse.<String>builder()
                .result("Logged out successfully")
                .build();
    }
}
