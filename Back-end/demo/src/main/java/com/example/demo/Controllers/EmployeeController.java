package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.History;
import com.example.demo.Repositories.EmployeeRepo;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.HistoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("admin/employee")
@AllArgsConstructor
public class    EmployeeController {
    EmployeeService employeeService;
    HistoryService historyService;
    EmployeeRepo employeeRepo;
    TokenProvider tokenProvider;
    @GetMapping("/show")
    @ResponseStatus(HttpStatus.OK)
    public List<Employee> showAll(@RequestBody Value<String> value, @RequestParam int page){
            return employeeRepo.listAll(value.getValue(),PageRequest.of(page,10));
    }
    @GetMapping("/information")
    @ResponseStatus(HttpStatus.OK)
    public Employee showAll(@RequestBody String username){
        System.out.println(username);
        return employeeService.findByUsername(username);
    }
    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void updateEmployee(@RequestBody @Valid Employee employee, HttpServletRequest request){
        Employee temp=employeeService.findByUsername(employee.getUsername());
        temp.setEmployee(employee);
        employeeService.save(temp);
        String auth=request.getHeader("Authorization");
        String name = tokenProvider.extractUsername(auth.substring(7));
        historyService.save(History.builder()
                        .msg(name+ " đã cập nhật nhân viên:"+ employee.getCode())
                        .time(new Timestamp(System.currentTimeMillis()))
                .build());
    }
    @DeleteMapping
    @Transactional
    @ResponseStatus(HttpStatus.OK)
    public void deleteEmployee(@RequestBody Value<String> value,HttpServletRequest request){
        String auth=request.getHeader("Authorization");
        employeeRepo.deleteByCode(value.getValue());
        String name = tokenProvider.extractUsername(auth.substring(7));
        historyService.save(History.builder()
                .msg(name+ " đã xóa nhân viên:"+ value.getValue())
                .time(new Timestamp(System.currentTimeMillis()))
                .build());
    }
}
