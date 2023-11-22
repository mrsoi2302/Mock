package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.PaymentGroup;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.PaymentGroupService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/payment-group")
public class PaymentGroupController {
    private final PaymentGroupService paymentGroupService;
    private final HistoryRepository historyRepository;
    private final SequenceRepository sequenceRepository;
    private final TokenProvider tokenProvider;
    private final EmployeeService employeeService;
    public PaymentGroupController(PaymentGroupService paymentGroupService, HistoryRepository historyRepository, SequenceRepository sequenceRepository, TokenProvider tokenProvider, EmployeeService employeeService) {
        this.paymentGroupService = paymentGroupService;
        this.historyRepository = historyRepository;
        this.sequenceRepository = sequenceRepository;
        this.tokenProvider = tokenProvider;
        this.employeeService = employeeService;
    }
    @PostMapping("/list")
    public List<PaymentGroup> list(@RequestBody Value<PaymentGroup> value){
        System.out.println(value.getValue().trim());
        return paymentGroupService.list(value.getValue().trim());
    }
    @GetMapping("/information")
    public PaymentGroup information(@RequestParam String code){
        return paymentGroupService.findByCode(code.trim());
    }
    @PostMapping("/staff/create")
    public void create(@RequestBody @Valid PaymentGroup paymentGroup, HttpServletRequest request){
        if(paymentGroupService.findByCode(paymentGroup.getCode())!=null) throw new CustomException("Loại phiếu chi đã tồn tại", HttpStatus.BAD_REQUEST);
        if(paymentGroup.getCode()==null||paymentGroup.getCode().trim().isEmpty()){
            paymentGroup.setCode("PMG"+sequenceRepository.generate());
        }else if(paymentGroup.getCode().matches("^PMG.*")) throw new CustomException("Tiền tố PMG không hợp lệ", HttpStatus.BAD_REQUEST);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        paymentGroupService.save(paymentGroup);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra loại phiếu chi "+paymentGroup.getCode());
    }
    @PutMapping("/admin")
    public void update(@RequestBody PaymentGroup paymentGroup,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        PaymentGroup p=paymentGroupService.findByCode(paymentGroup.getCode().trim());
        p.setName(paymentGroup.getName());
        paymentGroupService.save(p);
        historyRepository.save(t.getCode(),t.getName(),"đã cập nhật loại phiếu chi "+paymentGroup.getCode());
    }
    @Transactional
    @DeleteMapping("/admin")
    public void delete(@RequestBody List<String> listCode,HttpServletRequest request){
        paymentGroupService.deleteByListCode(listCode);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        for(String i:listCode){
            historyRepository.save(t.getCode(),t.getName(),"đã xóa loại phiếu chi "+i);
        }
    }
}
