package com.project.audiobook.controller;

import com.project.audiobook.dto.request.ForgetPassword.ForgetPasswordRequest;
import com.project.audiobook.dto.request.Login.LoginRequest;
import com.project.audiobook.dto.request.Login.LoginWithGoogleRequest;
import com.project.audiobook.dto.request.Login.RegisterRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Auth.ForgetPasswordResponse;
import com.project.audiobook.dto.response.Auth.LoginResponse;
import com.project.audiobook.dto.response.User.UserResponse;
import com.project.audiobook.service.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/user/auth")
public class UserAuthController {
    @Autowired
    UserAuthService userAuthService;

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

    //    @PostMapping("/login")
//    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
//        return ResponseEntity.ok(adminAuthService.login(request));
//    }

//    @PostMapping("/forget-password")
//    ApiResponse<ForgetPasswordResponse> forgetPassword(@RequestBody ForgetPasswordRequest request) {
//        return ApiResponse.<ForgetPasswordResponse>builder()
//                .result(adminAuthService.forgetPassword(request))
//                .build();
//    }
//
//    @PostMapping("/verify-code")
//    ApiResponse<VerifyCodeResponse> verifyCode(@RequestBody VerifyCodeRequest request) {
//        return ApiResponse.<VerifyCodeResponse>builder()
//                .result(adminAuthService.verifyCode(request))
//                .build();
//    }
//
//    @PutMapping("/reset-password")
//    ApiResponse<ResetPasswordResponse> resetPassword (@RequestBody ResetPasswordRequest request) {
//        return ApiResponse.<ResetPasswordResponse>builder()
//                .result(adminAuthService.resetPassword(request))
//                .build();
//    }
}
