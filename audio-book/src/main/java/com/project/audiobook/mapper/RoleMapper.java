package com.project.audiobook.mapper;

import com.project.audiobook.dto.response.Employee.RoleResponse;
import com.project.audiobook.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponse toRoleResponse(Role role);
}
