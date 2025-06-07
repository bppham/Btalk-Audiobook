package com.project.audiobook.mapper;

import com.project.audiobook.dto.request.Employee.EmployeeCreationRequest;
import com.project.audiobook.dto.request.Login.RegisterRequest;
import com.project.audiobook.dto.response.Employee.EmployeeResponse;
import com.project.audiobook.dto.response.User.UserResponse;
import com.project.audiobook.entity.Employee;
import com.project.audiobook.entity.Role;
import com.project.audiobook.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    User toUser(RegisterRequest request);
    UserResponse toUserResponse(User user);

}
