package com.project.audiobook.controller;

import com.project.audiobook.dto.request.Employee.EmployeeUpdatePasswordRequest;
import com.project.audiobook.dto.request.Employee.EmployeeUpdateRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Employee.EmployeeResponse;
import com.project.audiobook.service.EmployeeProfileService;
import com.project.audiobook.utils.JwtRequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/employee/info")
public class EmployeeProfileController {
    @Autowired
    EmployeeProfileService employeeProfileService;
    @Autowired
    private JwtRequestUtil jwtRequestUtil;

    @GetMapping
    ApiResponse<EmployeeResponse> getEmployeeInfo(HttpServletRequest httpRequest){
        Long employeeId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeProfileService.getEmployeeInfo(employeeId))
                .build();
    }

    @PutMapping("/update")
    ApiResponse<EmployeeResponse> updateInfo(@RequestBody EmployeeUpdateRequest request, HttpServletRequest httpRequest) throws IOException {
        Long employeeId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeProfileService.updateInfo(employeeId, request))
                .build();
    }

    @PutMapping("/change-password")
    ApiResponse<EmployeeResponse> changePassword(@RequestBody EmployeeUpdatePasswordRequest request, HttpServletRequest httpRequest) throws IOException {
        Long employeeId = jwtRequestUtil.getUserIdFromRequest(httpRequest);
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeProfileService.changePassword(employeeId, request))
                .build();
    }

}
