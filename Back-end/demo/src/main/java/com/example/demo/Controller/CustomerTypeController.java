package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.CustomerType;
import com.example.demo.Entities.ProviderType;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.CustomerTypeService;
import com.example.demo.Service.EmployeeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/customer-type")
@Transactional
public class CustomerTypeController {
    private HistoryRepository historyRepository;
    private EmployeeService employeeService;
    private TokenProvider tokenProvider;
    private CustomerTypeService customerTypeService;
    private SequenceRepository sequenceRepository;

    @PostMapping("/list")
    public List<CustomerType> list(@RequestBody Value<String> value){
        return customerTypeService.list(value.getValue());
    }
    @PostMapping("/staff/create")
    public void create(@RequestBody @Valid CustomerType customerType, HttpServletRequest request){
        if(customerTypeService.findByContentOrCode(customerType.getContent(),customerType.getCode())!=null) throw new CustomException("Nhóm KH đã tồn tại", HttpStatus.BAD_REQUEST);
        if(customerType.getCode()==null||customerType.getCode().trim().isEmpty()){
            customerType.setCode("CTT"+sequenceRepository.generate());
        }
        else if(customerType.getCode().matches("^CTT.*")) throw new CustomException("Tiền tố CTT ko hợp lệ",HttpStatus.BAD_REQUEST);
        customerTypeService.save(customerType);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra nhóm khách hàng "+customerType.getCode());
    }
    @DeleteMapping("/admin")
    @Transactional
    public void delete(@RequestParam String code, HttpServletRequest request){
        customerTypeService.deleteByCode(code);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã xóa nhóm khách hàng "+code);
    }


}
