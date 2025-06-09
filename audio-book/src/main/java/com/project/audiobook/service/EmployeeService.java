package com.project.audiobook.service;

import com.project.audiobook.dto.request.Employee.EmployeeCreationRequest;
import com.project.audiobook.dto.request.Employee.EmployeeUpdateRequest;
import com.project.audiobook.dto.response.Employee.EmployeeResponse;
import com.project.audiobook.entity.Employee;
import com.project.audiobook.entity.Role;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.EmployeeMapper;
import com.project.audiobook.repository.EmployeeRepository;
import com.project.audiobook.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class EmployeeService {
    @Value("${app.default-avatar-url}")
    private String defaultAvatarUrl;
    final EmployeeRepository employeeRepository;
    final EmployeeMapper employeeMapper;
    final RoleRepository roleRepository;
    final PasswordEncoder passwordEncoder;


    public EmployeeResponse createEmployee(EmployeeCreationRequest request) throws IOException {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMPLOYEE_EMAIL_EXISTED);
        }
        // Password
        request.setPassword(passwordEncoder.encode(request.getPhoneNumber()));
        List<Role> roles = (request.getRoleIds() != null) ? roleRepository.findAllById(request.getRoleIds()) : new ArrayList<>();

        if (request.getAvatar() == null || request.getAvatar().isEmpty()) {
            request.setAvatar(defaultAvatarUrl);
        }
        // DTO -> Entity và lưu và database
        Employee employee = employeeMapper.toEmployee(request, roles);
        employee = employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }

    public EmployeeResponse getEmployee(Long id){
        return employeeMapper.toEmployeeResponse(employeeRepository.findById(id).
                orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND)));
    }

    public void deleteEmployee(Long id){
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        employeeRepository.deleteById(id);
    }

    public List<EmployeeResponse> getAllEmployees(){
        return employeeRepository.findAll().stream().map(employeeMapper::toEmployeeResponse).collect(Collectors.toList());
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        if (request.getRoleIds() != null) {
            List<Role> roles = roleRepository.findAllById(request.getRoleIds());
            employee.setRoles(roles);
        }
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhoneNumber(request.getPhoneNumber());

        // Nếu có file avatar mới, lưu nó
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            employee.setAvatar(request.getAvatar());
        }

        employee = employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }
}
