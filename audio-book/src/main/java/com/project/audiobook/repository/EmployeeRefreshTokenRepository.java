package com.project.audiobook.repository;

import com.project.audiobook.entity.Employee;
import com.project.audiobook.entity.EmployeeRefreshToken;
import com.project.audiobook.enums.DeviceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRefreshTokenRepository extends JpaRepository<EmployeeRefreshToken, String> {
    Optional<EmployeeRefreshToken> findByToken(String token);
    boolean existsByToken(String token);
    void deleteByToken(String token);
    List<EmployeeRefreshToken> findAllByEmployee(Employee employee);
    Optional<EmployeeRefreshToken> findByEmployeeAndDeviceType(Employee employee, DeviceType deviceType);
}
