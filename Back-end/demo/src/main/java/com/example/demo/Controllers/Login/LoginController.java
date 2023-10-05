package com.example.demo.Controllers.Login;

import com.example.demo.DataType.BaseResponse;
import com.example.demo.Entities.History;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Security.UserService;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.HistoryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.Calendar;
import java.util.TimeZone;

@RestController
@AllArgsConstructor
@RequestMapping("/login")
public class LoginController {
    private TokenProvider tokenProvider;
    private UserService userService;
    private EmployeeService employeeService;
    private HistoryService historyService;
    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public BaseResponse loginResponse(@RequestBody LoginRequest loginRequest){
        userService.loadUserByUsername(loginRequest.getUsername());
        if(employeeService.findByUsernameAndPassword(loginRequest.getUsername(),loginRequest.getPassword())==null)
            throw new CustomException("Đăng nhập thất bại",HttpStatus.NOT_FOUND);
        String token = tokenProvider.tokenGenerator(loginRequest.getUsername());

        String username=tokenProvider.extractUsername(token);
        Calendar calendar=Calendar.getInstance(TimeZone.getTimeZone("GMT+7"));
        historyService.save(History.builder()
                .msg(username+" đã đăng nhập")
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .build());
        return BaseResponse.builder()
                .httpStatus(HttpStatus.ACCEPTED.value())
                .msg("Thành công")
                .data(new LoginResponse(token))
                .build();
//        return new BaseResponse(HttpStatus.ACCEPTED.value(), "Success",new LoginResponse(token));
    }
}
