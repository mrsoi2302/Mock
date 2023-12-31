package com.example.demo.Service;

import com.example.demo.DataType.EmployeeDTO;
import com.example.demo.Entities.Employee;
import com.example.demo.Repositories.EmployeeRepo;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class EmployeeService {
    private final EmployeeRepo employeeRepo;
    private SequenceRepository sequenceRepository;
    public Employee login(String username, String password) {
        return employeeRepo.findByUsernameAndPassword(username,password);
    }

    public List<EmployeeDTO> list(String value, String role, Pageable pageable) {
        return employeeRepo.list(value,role,pageable);
    }
    public Long countList(String value,String role){
        return employeeRepo.countList(value, role);
    }
    public void save(Employee employee) {
        employeeRepo.save(employee);
    }

    public Employee findByUsername(String username) {
        return employeeRepo.findByUsername(username);
    }
    public EmployeeDTO findByCode(String code) {
        return employeeRepo.findByCodeDTO(code);
    }
    public Employee findByCodes(String code) {
        return employeeRepo.findByCode(code);
    }
    public void update(Employee employee) {
        Employee temp=employeeRepo.findByCode(employee.getCode());
        temp.setEmployee(employee);
        employeeRepo.save(temp);
    }

    public void deleteByCode(String code) {
        employeeRepo.deleteByCode(code);
    }
    public void deleteAllByCode(List<String> list){
        employeeRepo.delete(list);
    }

    public void saveAll(List<Employee> list) {
        employeeRepo.saveAll(list);
    }

    public List<EmployeeDTO> list() {
        return employeeRepo.list();
    }

}
