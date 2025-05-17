package com.project.audiobook.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.audiobook.dto.request.Employee.EmployeeCreationRequest;
import com.project.audiobook.dto.request.Employee.EmployeeUpdationRequest;
import com.project.audiobook.dto.response.ApiResponse;
import com.project.audiobook.dto.response.Employee.EmployeeResponse;
import com.project.audiobook.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<EmployeeResponse> addEmployee(@Valid @RequestPart("employee") String employeeJson,
                                              @RequestPart(value = "avatar", required = false) MultipartFile avatar) throws JsonProcessingException{
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        EmployeeCreationRequest request = objectMapper.readValue(employeeJson, EmployeeCreationRequest.class);

        try {
            return ApiResponse.<EmployeeResponse>builder()
                    .result(employeeService.createEmployee(request, avatar))
                    .build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<EmployeeResponse> updateEmployee(@Valid
                                                   @PathVariable Long id,
                                                   @RequestPart("employee") String employeeJson,
                                                   @RequestPart(value = "avatar", required = false) MultipartFile image) throws JsonProcessingException{
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        EmployeeUpdationRequest request = objectMapper.readValue(employeeJson, EmployeeUpdationRequest.class);
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.updateEmployee(id, request, image))
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
    public ApiResponse<List<EmployeeResponse>> getAllEmployee() {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(employeeService.getAllEmployees())
                .build();
    }



}
