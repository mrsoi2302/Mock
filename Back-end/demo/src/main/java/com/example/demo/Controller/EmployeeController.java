package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/employee")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final TokenProvider tokenProvider;
    private final HistoryRepository historyRepository;
    private SequenceRepository sequenceRepository;

    @PostMapping("/admin/list")
    public List<Employee> list(@RequestBody Value<Employee> value,@RequestParam(name = "page") int page,@RequestParam(name = "limit") int limit){
        return employeeService.list(value.getValue(),value.getT().getRole(), PageRequest.of(page,limit));
    }
    @GetMapping("admin/list")
    public List<Employee> list(){
        return employeeService.list();
    }
    @PostMapping("/count-list")
    public Long countList(@RequestBody Value<Employee> value){
        return employeeService.countList(value.getValue(),value.getT().getRole());
    }
    @PostMapping("/admin/create-one")
    public void create(@RequestBody Employee employee, HttpServletRequest request){
        if(employee.getCode().matches("^EPL.*")) throw new CustomException("Tiền tố EPL không hợp lệ", HttpStatus.BAD_REQUEST);
        if(employeeService.findByCode(employee.getCode())!=null&&employeeService.findByUsername(employee.getUsername())!=null) throw new CustomException("NV đã tồn tại",HttpStatus.BAD_REQUEST);
        else if (employee.getCode().trim().isEmpty()||employee.getCode()==null){
            employee.setCode("EPL"+sequenceRepository.generate());
        }
        employee.setPassword(String.valueOf(employee.getPassword().hashCode()));
        employeeService.save(employee);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra tài khoản "+employee.getCode());
    }
    @PostMapping("/admin/create-many")
    public void createList(@RequestBody List<Employee> list,HttpServletRequest request){
        for(Employee i:list){
            if (i.getCode()==null||i.getCode().trim().isEmpty()){
                int index=list.indexOf(i);
                i.setCode("EPL"+sequenceRepository.generate());
                i.setPassword(String.valueOf(i.getPassword().hashCode()));
                list.set(index,i);
            }else if(i.getCode().matches("^EPL.*")) throw new CustomException("Tiền tố EPL không hợp lệ", HttpStatus.BAD_REQUEST);
            else if(employeeService.findByCode(i.getCode())!=null) throw new CustomException("NV đã tồn tại",HttpStatus.BAD_REQUEST);

        }
        employeeService.saveAll(list);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        for(Employee i:list){
            historyRepository.save(t.getCode(),t.getName(),"đã tạo ra tài khoản "+i.getCode());
        }



    }
    @GetMapping("admin/information")
    public Employee information(@RequestParam String code){
        Employee employee=employeeService.findByCode(code);
        if(employee==null) throw new CustomException("Không tồn tại", HttpStatus.NOT_FOUND);
        return employee;
    }
    @PutMapping("/admin")
    @Transactional
    public void update(@RequestBody Employee employee,HttpServletRequest request){
        employeeService.update(employee);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã cập nhật tài khoản "+employee.getCode());
    }
    @DeleteMapping("/admin")
    @Transactional
    public void delete(@RequestBody List<String> list,HttpServletRequest request){
        employeeService.deleteAllByCode(list);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        for(String i:list){
            historyRepository.save(t.getCode(),t.getName(),"đã xóa tài khoản "+i);
        }


    }





}
