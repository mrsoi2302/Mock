package com.example.demo.Repositories;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Employee;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Long> {
    Employee findByUsername(String username);
    @Query("select e from Employee e where " +
            ":value is null or " +
            "e.username like concat('%',:value,'%') " +
            "or " +
            "e.name like concat('%',:value,'%') " +
            "or " +
            "e.code like concat('%',:value,'%') " +
            "or " +
            "e.role like concat('%',:value,'%') ")
    List<Employee> listAll(String value,Pageable pageable);
    void deleteByCode(String code);
    Employee findByUsernameAndPassword(String username, String password);
}
