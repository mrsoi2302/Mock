package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
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
    public Value<String> login(@RequestBody Employee employee){
        if(employeeService.login(employee.getUsername(), String.valueOf(employee.getPassword().hashCode()))==null) throw new CustomException("Sai thông tin", HttpStatus.NOT_FOUND);
        return new Value<>(tokenProvider.tokenGenerator(employee.getUsername()),employeeService.findByUsername(employee.getUsername()).getRole());
    }
    @PostMapping("/change-password")
    public void changePassword(@RequestBody Value<String> value, HttpServletRequest request){
        System.out.println(value);
        String token=request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee employee=employeeService.findByUsername(username);
        if(!employee.getPassword().equals(String.valueOf(value.getValue().hashCode()))) throw new CustomException("Sai mật khẩu hiện tại",HttpStatus.BAD_REQUEST);
        employee.setPassword(String.valueOf(value.getT().hashCode()));
        employeeService.update(employee);
    }
}
