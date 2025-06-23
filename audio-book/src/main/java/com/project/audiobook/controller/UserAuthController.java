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
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.service.UserAuthService;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Duration;

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
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = userAuthService.login(request);

        // Tạo HttpOnly cookie
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", loginResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false) // ⚠️ Chỉ dùng true nếu HTTPS (có thể set false nếu đang dev local)
                .path("/") // Cookie sẽ gửi kèm với request đến đường dẫn này
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax") // hoặc "Lax" nếu frontend/backend khác origin
                .build();

        // Xoá refreshToken khỏi response body nếu muốn tăng bảo mật
        loginResponse.setRefreshToken(null);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResponse.<LoginResponse>builder()
                        .result(loginResponse)
                        .build());
    }

    @PostMapping("/loginWithGoogle")
    public ResponseEntity<ApiResponse<LoginResponse>> loginWithGoogle(@RequestBody LoginWithGoogleRequest request) {
        LoginResponse loginResponse = userAuthService.loginWithGoogle(request);

        // Tạo HttpOnly cookie
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", loginResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false) // dùng true nếu chạy HTTPS
                .path("/") // để cookie gửi kèm toàn bộ request
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax")
                .build();

        // Xoá refreshToken khỏi body nếu cần bảo mật
        loginResponse.setRefreshToken(null);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResponse.<LoginResponse>builder()
                        .result(loginResponse)
                        .build());
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
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshTokenCookie) {

        if (refreshTokenCookie == null || refreshTokenCookie.isEmpty()) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_REQUIRED);
        }

        RefreshTokenResponse response = userAuthService.refreshToken(refreshTokenCookie);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            HttpServletRequest request,
            @CookieValue(value = "refreshToken", required = false) String refreshTokenCookie) {

        System.out.println("Refresh token logout: " + refreshTokenCookie);
        // 1. Lấy access token từ header Authorization
        String accessToken = jwtRequestUtil.extractAccessToken(request);

        // 2. Gọi service để đưa refresh và access token vào blacklist nếu có
        if (refreshTokenCookie != null && !refreshTokenCookie.isEmpty()) {
            userAuthService.logout(accessToken, refreshTokenCookie);
        }

        // 3. Xoá refreshToken ở phía client bằng cách gửi cookie trống
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // dùng `true` nếu là HTTPS
                .path("/") // phải giống path ban đầu tạo cookie
                .maxAge(0) // Xoá ngay lập tức
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(ApiResponse.success("Logged out successfully"));
    }
}
