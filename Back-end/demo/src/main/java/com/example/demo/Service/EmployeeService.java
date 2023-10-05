package com.example.demo.Service;

import com.example.demo.Entities.Employee;
import com.example.demo.Repositories.EmployeeRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.lang.reflect.GenericDeclaration;
import java.lang.reflect.TypeVariable;
import java.util.List;

@AllArgsConstructor
@Service
public class EmployeeService {
    private final EmployeeRepo employeeRepo;
    public Employee findByUsername(String username) {
        return employeeRepo.findByUsername(username);
    }
    public void save(Employee employee) {
        employeeRepo.save(employee);
    }

    public List<Employee> listAll(String value,Pageable pageable) {
        return employeeRepo.listAll(value,pageable);
    }

    public void deleteByCode(String code) {
        employeeRepo.deleteByCode(code);
    }

    public Employee findByUsernameAndPassword(String username, String password) {
        return employeeRepo.findByUsernameAndPassword(username,password);
    }

    public long count() {
        return employeeRepo.count();
    }

    public void deleteById(long id) {
        employeeRepo.deleteById(id);
    }
}
