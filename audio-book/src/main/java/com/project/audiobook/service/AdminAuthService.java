package com.project.audiobook.service;

import com.project.audiobook.dto.request.ForgetPassword.ForgetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.ResetPasswordRequest;
import com.project.audiobook.dto.request.ForgetPassword.VerifyCodeRequest;
import com.project.audiobook.dto.request.Login.LoginRequest;
import com.project.audiobook.dto.response.Auth.ForgetPasswordResponse;
import com.project.audiobook.dto.response.Auth.LoginResponse;
import com.project.audiobook.dto.response.Auth.ResetPasswordResponse;
import com.project.audiobook.dto.response.Auth.VerifyCodeResponse;
import com.project.audiobook.entity.Employee;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.repository.EmployeeRepository;
import com.project.audiobook.utils.EmailUtil;
import com.project.audiobook.utils.JwtUtil;
import com.project.audiobook.utils.VerifyCodeUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public LoginResponse login(LoginRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = jwtUtil.generateToken(employee);

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setName(employee.getName());
        response.setEmail(employee.getEmail());

        return response;
    }

    public ForgetPasswordResponse forgetPassword(ForgetPasswordRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_EMPLOYEE_EMAIL));
        String rawCode = verifyCodeUtil.generateRawCode();
        String hashCode = verifyCodeUtil.hashCode(rawCode);
        emailUtil.sendVerificationEmail(request.getEmail(), rawCode);
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

    public ResetPasswordResponse resetPassword (ResetPasswordRequest request) {
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

}
