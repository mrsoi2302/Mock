package com.example.demo.Controllers.Login;

import com.example.demo.DataType.BaseResponse;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Security.UserService;
import com.example.demo.Service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/login")
public class LoginController {
    private TokenProvider tokenProvider;
    private UserService userService;
    private EmployeeService employeeService;
    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public BaseResponse loginResponse(@RequestBody LoginRequest loginRequest){
        userService.loadUserByUsername(loginRequest.getUsername());
        employeeService.findByUsernameAndPassword(loginRequest.getUsername(),loginRequest.getPassword());
        String token = tokenProvider.tokenGenerator(loginRequest.getUsername());
        return BaseResponse.builder()
                .httpStatus(HttpStatus.ACCEPTED.value())
                .msg("Thành công")
                .data(new LoginResponse(token))
                .build();
//        return new BaseResponse(HttpStatus.ACCEPTED.value(), "Success",new LoginResponse(token));
    }
}
