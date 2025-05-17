package com.project.audiobook.mapper;

import com.project.audiobook.dto.request.Employee.EmployeeCreationRequest;
import com.project.audiobook.dto.response.Employee.EmployeeResponse;
import com.project.audiobook.entity.Employee;
import com.project.audiobook.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    @Mapping(target = "roles", source = "roles")
    @Mapping(target = "id", ignore = true)
    Employee toEmployee(EmployeeCreationRequest request, List<Role> roles);

    @Mapping(source = "id", target = "id")
    @Mapping(target = "roleIds", source = "roles", qualifiedByName = "mapRoles")
    @Mapping(target = "roleNames", source = "roles", qualifiedByName = "mapRoleNames")
    EmployeeResponse toEmployeeResponse(Employee employee);



    @Named("mapRoles")
    default List<Long> mapRoles(List<Role> roles) {
        return (roles != null) ? roles.stream().map(Role::getId).collect(Collectors.toList()) : null;
    }

    @Named("mapRoleNames")
    default List<String> mapRoleNames(List<Role> roles) {
        if (roles != null) {
            return roles.stream().map(Role::getName).collect(Collectors.toList());
        }
        return null;
    }

//    @Named("mapRoleNames")
//    default Set<String> mapRoleNames(Set<Role> roles) {
//        return roles.stream().map(Role::getName).collect(Collectors.toSet());
//    }
//
//    @Named("mapRoleEntities")
//    default Set<Role> mapRoleEntities(Set<String> roleNames) {
//        return roleNames.stream().map(name -> {
//            Role role = new Role();
//            role.setName(name);
//            return role;
//        }).collect(Collectors.toSet());
//    }
//
//    @Mapping(source = "roles", target = "roles", qualifiedByName = "mapRoleEntities")
//    void updateEmployeeFromRequest(EmployeeUpdationRequest request, @MappingTarget Employee employee);
}
