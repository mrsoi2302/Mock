package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.PaymentGroup;
import com.example.demo.Entities.ReceiptGroup;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.ReceiptGroupService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/receipt-group")
public class ReceiptGroupController {
    private final ReceiptGroupService receiptGroupService;
    private final EmployeeService employeeService;
    private final HistoryRepository historyRepository;
    private final TokenProvider tokenProvider;
    private final SequenceRepository sequenceRepository;

    public ReceiptGroupController(ReceiptGroupService receiptGroupService, EmployeeService employeeService, HistoryRepository historyRepository, TokenProvider tokenProvider, SequenceRepository sequenceRepository) {
        this.receiptGroupService = receiptGroupService;
        this.employeeService = employeeService;
        this.historyRepository = historyRepository;
        this.tokenProvider = tokenProvider;
        this.sequenceRepository = sequenceRepository;
    }
    @PostMapping("/list")
    public List<ReceiptGroup> list(@RequestBody Value<PaymentGroup> value){
        return receiptGroupService.list(value.getValue());
    }
    @GetMapping("/information")
    public ReceiptGroup information(@RequestParam String code){
        return receiptGroupService.findByCode(code.trim());
    }
    @PostMapping("/staff/create")
    public void create(@RequestBody @Valid ReceiptGroup receiptGroup, HttpServletRequest request){
        if(receiptGroupService.findByCode(receiptGroup.getCode())!=null) throw new CustomException("Loại phiếu thu đã tồn tại", HttpStatus.BAD_REQUEST);
        if(receiptGroup.getCode()==null||receiptGroup.getCode().trim().isEmpty()){
            receiptGroup.setCode("RCG"+sequenceRepository.generate());
        }else if(receiptGroup.getCode().matches("^RCG.*")) throw new CustomException("Tiền tố RCG không hợp lệ", HttpStatus.BAD_REQUEST);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        receiptGroupService.save(receiptGroup);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra loại phiếu thu "+receiptGroup.getCode());
    }
    @PutMapping("/admin")
    public void update(@RequestBody ReceiptGroup receiptGroup, HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        ReceiptGroup p=receiptGroupService.findByCode(receiptGroup.getCode().trim());
        p.setName(receiptGroup.getName());
        receiptGroupService.save(p);
        historyRepository.save(t.getCode(),t.getName(),"đã cập nhật loại phiếu thu "+receiptGroup.getCode());
    }
    @Transactional
    @DeleteMapping("/admin")
    public void delete(@RequestBody List<String> listCode,HttpServletRequest request){
        receiptGroupService.deleteByListCode(listCode);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        for(String i:listCode){
            historyRepository.save(t.getCode(),t.getName(),"đã xóa loại phiếu thu "+i);
        }
    }
}
