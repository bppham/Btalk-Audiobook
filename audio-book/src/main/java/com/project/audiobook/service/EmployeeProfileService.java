package com.project.audiobook.service;

import com.project.audiobook.dto.request.Employee.EmployeeUpdatePasswordRequest;
import com.project.audiobook.dto.request.Employee.EmployeeUpdateRequest;
import com.project.audiobook.dto.response.Employee.EmployeeResponse;
import com.project.audiobook.entity.Employee;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.EmployeeMapper;
import com.project.audiobook.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class EmployeeProfileService {
    @Value("${app.default-avatar-url}")
    private String defaultAvatarUrl;
    final EmployeeRepository employeeRepository;
    final PasswordEncoder passwordEncoder;
    final EmployeeMapper employeeMapper;
    // Get info
    public EmployeeResponse getEmployeeInfo(Long id) {
        return employeeMapper.toEmployeeResponse(employeeRepository.findById(id).
                orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND)));
    }
    // Update info (name)
    public EmployeeResponse updateInfo(Long employeeId, EmployeeUpdateRequest request) throws IOException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        employee.setName(request.getName());
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            employee.setAvatar(request.getAvatar());
        }
        employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }
    // Update info (password)
    public EmployeeResponse changePassword(Long employeeId, EmployeeUpdatePasswordRequest request) throws IOException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        if (!passwordEncoder.matches(request.getOldPassword(), employee.getPassword())) {
            throw new AppException(ErrorCode.WRONG_OLD_PASSWORD);
        }
        employee.setPassword(passwordEncoder.encode(request.getNewPassword()));
        employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }
}
