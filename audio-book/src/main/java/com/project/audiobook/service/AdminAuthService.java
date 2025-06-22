package com.project.audiobook.service;

import com.project.audiobook.dto.request.ForgetPassword.ForgetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.ResetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.VerifyCodeRequest;
import com.project.audiobook.dto.request.Login.LoginRequest;
import com.project.audiobook.dto.request.Login.RefreshTokenRequest;
import com.project.audiobook.dto.response.Auth.*;
import com.project.audiobook.entity.*;
import com.project.audiobook.enums.DeviceType;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.repository.BlacklistedTokenRepository;
import com.project.audiobook.repository.EmployeeRefreshTokenRepository;
import com.project.audiobook.repository.EmployeeRepository;
import com.project.audiobook.utils.EmailUtil;
import com.project.audiobook.utils.JwtUtil;
import com.project.audiobook.utils.VerifyCodeUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminAuthService {
    EmployeeRepository employeeRepository;
    PasswordEncoder passwordEncoder;
    JwtUtil jwtUtil;
    VerifyCodeUtil verifyCodeUtil;
    EmailUtil emailUtil;
    EmployeeRefreshTokenRepository refreshTokenRepository;
    BlacklistedTokenRepository blacklistedTokenRepository;

    public LoginResponse login(LoginRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_EMPLOYEE_EMAIL));

        if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtUtil.generateToken(employee);
        String refreshTokenString = jwtUtil.generateRefreshToken();
        DeviceType deviceType = request.getDeviceType() != null ? request.getDeviceType() : DeviceType.WEB;

        // Tìm refresh token theo nhân viên + thiết bị
        EmployeeRefreshToken refreshToken = refreshTokenRepository
                .findByEmployeeAndDeviceType(employee, deviceType)
                .orElse(new EmployeeRefreshToken());

        refreshToken.setToken(refreshTokenString);
        refreshToken.setCreatedAt(LocalDateTime.now());
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshToken.setEmployee(employee);
        refreshToken.setDeviceType(deviceType);
        refreshToken.setSavedAt(LocalDateTime.now());

        refreshTokenRepository.save(refreshToken);

        LoginResponse response = new LoginResponse();
        response.setToken(accessToken);
        response.setName(employee.getName());
        response.setEmail(employee.getEmail());
        response.setRefreshToken(refreshTokenString);

        return response;
    }


    public ForgetPasswordResponse forgetPassword(ForgetPasswordRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_EMPLOYEE_EMAIL));
        String rawCode = verifyCodeUtil.generateRawCode();
        String hashCode = verifyCodeUtil.hashCode(rawCode);
        emailUtil.sendVerificationEmail(request.getEmail(), rawCode, "EMPLOYEE");
        employee.setVerifyCode(hashCode);
        employee.setVerifyCodeCreatedAt(LocalDateTime.now());
        employeeRepository.save(employee);

        ForgetPasswordResponse response = new ForgetPasswordResponse();
        response.setEmail(employee.getEmail());
        return response;
    }

    public VerifyCodeResponse verifyCode(VerifyCodeRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_EMPLOYEE_EMAIL));
        // Kiểm tra thời gian hết hạn mã
        if (employee.getVerifyCodeCreatedAt() == null ||
                Duration.between(employee.getVerifyCodeCreatedAt(), LocalDateTime.now()).toMinutes() >= 2) {
            throw new AppException(ErrorCode.EXPIRED_VERIFY_CODE);
        }

        // Kiểm tra mã có khớp không
        if (!passwordEncoder.matches(request.getCode(), employee.getVerifyCode())) {
            throw new AppException(ErrorCode.INVALID_VERIFY_CODE);
        }
        VerifyCodeResponse response = new VerifyCodeResponse();
        response.setEmail(employee.getEmail());
        return response;
    }

    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_EMPLOYEE_EMAIL));

        String newPassword = request.getPassword();
        String hashPassword = passwordEncoder.encode(newPassword);

        employee.setPassword(hashPassword);
        employeeRepository.save(employee);

        ResetPasswordResponse response = new ResetPasswordResponse();
        response.setEmail(employee.getEmail());
        return response;
    }

    @Transactional
    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        EmployeeRefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REFRESH_TOKEN));
        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new AppException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }
        Employee employee = refreshToken.getEmployee();
        String newAccessToken = jwtUtil.generateToken(employee);
        RefreshTokenResponse response = new RefreshTokenResponse();
        response.setToken(newAccessToken);
        return response;
    }

    public void logout(String accessToken, RefreshTokenRequest request) {
        EmployeeRefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REFRESH_TOKEN));
        if (!accessToken.isEmpty()) {
            LocalDateTime expiresAt = jwtUtil.extractExpiration(accessToken);
            blacklistedTokenRepository.save(new BlacklistedToken(accessToken, expiresAt));
        }
        refreshTokenRepository.delete(refreshToken);
    }

}
