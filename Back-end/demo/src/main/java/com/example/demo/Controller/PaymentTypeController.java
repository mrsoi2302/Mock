package com.example.demo.Controller;


import com.example.demo.Entities.Employee;
import com.example.demo.Entities.PaymentType;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.PaymentTypeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment-type")
public class PaymentTypeController {
    private HistoryRepository historyRepository;
    private EmployeeService employeeService;
    private TokenProvider tokenProvider;
    private PaymentTypeService paymentTypeService;
    private SequenceRepository sequenceRepository;

    @PostMapping("/list")
    public List<PaymentType> list(@RequestBody String value){
        return paymentTypeService.list(value);
    }
    @PostMapping("/admin/create")
    public void create(@RequestBody PaymentType paymentType, HttpServletRequest request){
        if(paymentTypeService.findByName(paymentType.getName())!=null)
            throw new CustomException("Nhóm NCC đã tồn tại", HttpStatus.BAD_REQUEST);
        paymentTypeService.save(paymentType);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra nhóm nhà cung cấp "+paymentType.getName());
    }
    @DeleteMapping("/admin")
    @Transactional
    public void delete(@RequestParam String name, HttpServletRequest request){
        paymentTypeService.deleteByName(name);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã xóa nhóm nhà cung cấp"+name);
    }


}
