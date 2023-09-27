package com.example.demo.Controllers;

import com.example.demo.DataType.BaseResponse;
import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.History;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.HistoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//
import java.sql.Timestamp;

@RestController
@AllArgsConstructor
public class AccountController {
    private EmployeeService employeeService;
    private HistoryService historyService;
    private TokenProvider tokenProvider;
    @PostMapping("/admin/create-account")
    public ResponseEntity<BaseResponse> create(@Valid @RequestBody Employee employee, HttpServletRequest request){
        if(employeeService.findByUsername(employee.getUsername())!=null)
            throw new CustomException("Tài khoản đã tồn tại",HttpStatus.BAD_REQUEST);
        employeeService.save(employee);
        String token=request.getHeader("Authorization").substring(7);
        String name= employeeService.findByUsername(tokenProvider.extractUsername(token)).getName();
        History history=new History(
                null,
                name+" đã tạo tài khoản "+employee.getUsername(),
                new Timestamp(System.currentTimeMillis())
        );
        historyService.save(history);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                BaseResponse.builder()
                        .httpStatus(HttpStatus.CREATED.value())
                        .msg("Success")
                        .build()
        );
    }
    @PutMapping("/change-password")
    public void changePassword(@RequestBody Value<String> value, HttpServletRequest httpServletRequest){
        String username =tokenProvider.extractUsername(httpServletRequest.getHeader("Authorization").substring(7));
        Employee employee=employeeService.findByUsername(username);
        if(value.getT().equals(employee.getPassword())) throw new CustomException("Sai mật khẩu",HttpStatus.BAD_REQUEST);
        employee.setPassword(value.getValue());
        employeeService.save(employee);

        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()))
                .msg(username + "đã thay đổi mật khẩu").build());
    }
}
