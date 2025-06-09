package com.project.audiobook.controller;

import com.project.audiobook.dto.request.Employee.EmployeeCreationRequest;
import com.project.audiobook.dto.request.Employee.EmployeeUpdateRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Employee.EmployeeResponse;
import com.project.audiobook.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    ApiResponse<EmployeeResponse> addEmployee(@RequestBody EmployeeCreationRequest request) throws IOException {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.createEmployee(request))
                .build();
    }

    @PutMapping(value = "/{id}")
    ApiResponse<EmployeeResponse> updateEmployee(@PathVariable Long id, @RequestBody EmployeeUpdateRequest request){
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.updateEmployee(id, request))
                .build();
    }

    @DeleteMapping(value = "/{id}")
    public ApiResponse<String> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ApiResponse.<String>builder().result("Employee has been deleted").build();
    }

    @GetMapping(value = "/{id}")
    ApiResponse<EmployeeResponse> getEmployeeById(@PathVariable Long id){
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.getEmployee(id))
                .build();
    }

    @GetMapping
     ApiResponse<List<EmployeeResponse>> getAllEmployee() {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(employeeService.getAllEmployees())
                .build();
    }



}
