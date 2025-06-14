package com.project.audiobook.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import com.project.audiobook.dto.request.ForgetPassword.ForgetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.ResetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.VerifyCodeRequest;
import com.project.audiobook.dto.request.Login.LoginRequest;
import com.project.audiobook.dto.request.Login.LoginWithGoogleRequest;
import com.project.audiobook.dto.request.Login.RegisterRequest;
import com.project.audiobook.dto.response.Auth.ForgetPasswordResponse;
import com.project.audiobook.dto.response.Auth.LoginResponse;
import com.project.audiobook.dto.response.Auth.ResetPasswordResponse;
import com.project.audiobook.dto.response.Auth.VerifyCodeResponse;
import com.project.audiobook.dto.response.User.UserResponse;
import com.project.audiobook.entity.User;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.UserMapper;
import com.project.audiobook.repository.UserRepository;
import com.project.audiobook.enums.AuthProvider;
import com.project.audiobook.utils.EmailUtil;
import com.project.audiobook.utils.JwtUtil;
import com.project.audiobook.utils.VerifyCodeUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class UserAuthService {
    @Value("${google.clientId}")
    private String googleClientId;
    @Value("${app.default-avatar-url}")
    private String defaultAvatarUrl;
    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;
    final JwtUtil jwtUtil;
    final VerifyCodeUtil verifyCodeUtil;
    final EmailUtil emailUtil;
    final UserMapper userMapper;

    // Register
    public UserResponse registerUser(RegisterRequest request) throws IOException {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EMAIL_EXISTED);
        }
        if (request.getPhotoURL() == null || request.getPhotoURL().isEmpty()) {
            request.setPhotoURL(defaultAvatarUrl);
        }
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        User user = userMapper.toUser(request);
        user.setAuthProvider(AuthProvider.LOCAL);
        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    // Login with email and password
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Nếu user có password thì cho login (bất kể authProvider là gì)
        if (user.getPassword() == null) {
            throw new AppException(ErrorCode.ACCOUNT_NO_PASSWORD);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("Request: " + request.getPassword());
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        String token = jwtUtil.generateTokenForUser(user);

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        return response;
    }

    // Login with Google
    public LoginResponse loginWithGoogle(LoginWithGoogleRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier
                    .Builder(GoogleNetHttpTransport.newTrustedTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                System.out.println("Payload: " + payload);
                System.out.println("Payload keys and values:");
                for (String key : payload.keySet()) {
                    System.out.println(key + " : " + payload.get(key));
                }
                String email = payload.getEmail();

                String name = request.getName();
                String photoURL = request.getPhotoURL();

                User user = userRepository.findByEmail(email)
                        .orElseGet(() -> {
                            User newUser = new User();
                            newUser.setEmail(email);
                            newUser.setName(name);
                            newUser.setPhotoURL(photoURL);
                            newUser.setAuthProvider(AuthProvider.GOOGLE);
                            return userRepository.save(newUser);
                        });

                String token = jwtUtil.generateTokenForUser(user);

                LoginResponse response = new LoginResponse();
                response.setToken(token);
                response.setName(user.getName());
                response.setEmail(user.getEmail());
                return response;
            } else {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public ForgetPasswordResponse forgetPassword(ForgetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        String rawCode = verifyCodeUtil.generateRawCode();
        String hashCode = verifyCodeUtil.hashCode(rawCode);
        emailUtil.sendVerificationEmail(request.getEmail(), rawCode, "CLIENT");
        user.setVerifyCode(hashCode);
        user.setVerifyCodeCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        ForgetPasswordResponse response = new ForgetPasswordResponse();
        response.setEmail(user.getEmail());
        return response;
    }

    public VerifyCodeResponse verifyCode(VerifyCodeRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        // Kiểm tra thời gian hết hạn mã
        if (user.getVerifyCodeCreatedAt() == null ||
                Duration.between(user.getVerifyCodeCreatedAt(), LocalDateTime.now()).toMinutes() >= 2) {
            throw new AppException(ErrorCode.EXPIRED_VERIFY_CODE);
        }

        // Kiểm tra mã có khớp không
        if (!passwordEncoder.matches(request.getCode(), user.getVerifyCode())) {
            throw new AppException(ErrorCode.INVALID_VERIFY_CODE);
        }
        VerifyCodeResponse response = new VerifyCodeResponse();
        response.setEmail(user.getEmail());
        return response;
    }

    public ResetPasswordResponse resetPassword (ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String newPassword = request.getPassword();
        String hashPassword = passwordEncoder.encode(newPassword);

        user.setPassword(hashPassword);
        userRepository.save(user);

        ResetPasswordResponse response = new ResetPasswordResponse();
        response.setEmail(user.getEmail());
        return response;
    }
}
