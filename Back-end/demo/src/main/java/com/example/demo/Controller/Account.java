package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@Transactional
public class Account {
    private final EmployeeService employeeService;
    private final TokenProvider tokenProvider;
    @PostMapping("login")
    public String login(@RequestBody Employee employee){
        if(employeeService.login(employee.getUsername(), String.valueOf(employee.getPassword().hashCode()))==null) throw new CustomException("Sai thông tin", HttpStatus.NOT_FOUND);
        return tokenProvider.tokenGenerator(employee.getUsername());
    }
    @PostMapping("/change-password")
    public void changePassword(@RequestBody Value<Employee> employee){
        Employee temp=employeeService.findByCode(employee.getT().getCode());
        if(!String.valueOf(temp.getPassword().hashCode()).equals(employee.getT().getPassword())) throw new CustomException("Sai mật khẩu cũ",HttpStatus.BAD_REQUEST);
        temp.setPassword(String.valueOf(employee.getValue().hashCode()));
    }
}
