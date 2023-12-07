package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.ProviderType;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.ProviderTypeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Transactional
@RequestMapping("/provider-type")
public class ProviderTypeController {
    private HistoryRepository historyRepository;
    private EmployeeService employeeService;
    private TokenProvider tokenProvider;
    private ProviderTypeService providerTypeService;
    private SequenceRepository sequenceRepository;

    @PostMapping("/list")
    public List<ProviderType> list(@RequestBody(required = false) Value<String> value){
        return providerTypeService.list(value.getValue());
    }
    @PostMapping("/staff/create")
    public void create(@RequestBody @Valid ProviderType providerType, HttpServletRequest request){
        if(providerType.getCode()==null){
            providerType.setCode("PRT"+sequenceRepository.generate());
        }
        else if(providerType.getCode().matches("^PRT.*")) throw new CustomException("Tiền tố PRT ko hợp lệ",HttpStatus.BAD_REQUEST);
        else if(providerTypeService.findByContentOrCode(providerType.getContent(),providerType.getCode())!=null)
            throw new CustomException("Nhóm NCC đã tồn tại", HttpStatus.BAD_REQUEST);
        providerTypeService.save(providerType);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra nhóm nhà cung cấp "+providerType.getCode());
    }
    @DeleteMapping("/admin")
    @Transactional
    public void delete(@RequestParam String code, HttpServletRequest request){
        providerTypeService.deleteByCode(code);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã xóa nhóm nhà cung cấp"+code);
    }


}
