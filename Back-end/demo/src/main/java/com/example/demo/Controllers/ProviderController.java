package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.History;
import com.example.demo.Entities.Provider;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.HistoryService;
import com.example.demo.Service.ProviderService;
import com.example.demo.Service.ReceiptService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@AllArgsConstructor
public class ProviderController {
    ReceiptController receiptController;
    HistoryService historyService;
    ProviderService providerService;
    TokenProvider tokenProvider;
    EmployeeService employeeService;
    ReceiptService receiptService;
    @GetMapping("/provider/count")
    public long count(){
        return providerService.count();
    }
    @GetMapping("/provider/findall")
    List<Provider> providerList(){
        return providerService.findAll();
    }
    @PostMapping("/provider/show")      
    @ResponseStatus(HttpStatus.OK)
    public List<Provider> showAll(@RequestBody Value<Provider> value, @RequestParam int page){
        System.out.println(value.getT());
        return providerService.listAll(value, PageRequest.of(page,10));
    }
    @GetMapping("/provider/information")
    @ResponseStatus(HttpStatus.OK)
    public Provider showInformation(@RequestParam String code){
        return providerService.findByCode(code);
    }
    @PostMapping("/admin/provider")
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public void createProvider(@RequestBody Provider provider, HttpServletRequest request){
        if(providerService.findByCode(provider.getCode())!=null) throw new CustomException("Nguồn cung đã tồn tại",HttpStatus.BAD_REQUEST);
        if(!provider.getContact().matches("^\\d+$")) throw new CustomException("Số điện thoại không hợp lệ",HttpStatus.BAD_REQUEST);
        String token= request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee employee= employeeService.findByUsername(username);
        provider.setCreated_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        Set<Employee> set=new HashSet<>();
        Employee employee1=employee;
        employee1.setPassword("");
        set.add(employee1);
        provider.setEmployees(set);
        providerService.save(provider);
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username+ " đã tạo ra nguồn cung "+provider.getCode())
                .build());
    }
    @PutMapping("/admin/provider")
    @Transactional
    @ResponseStatus(HttpStatus.OK)
    public void updateProvider(@RequestBody Provider provider, HttpServletRequest request){
        System.out.println(provider);
        Provider temp=providerService.findByCode(provider.getCode());
        if(temp==null) throw new CustomException("Nguồn cung không tồn tại",HttpStatus.NOT_FOUND);
        if(provider.getContact().matches("\\D")) throw new CustomException("Số điện thoại không hợp lệ",HttpStatus.BAD_REQUEST);
        provider.setModified_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        temp.setProvider(provider);
        providerService.save(temp);
        String token= request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                .build());
    }
    
    @DeleteMapping("admin/provider")
    @Transactional
    @ResponseStatus(HttpStatus.OK)
    public void deleteProvider(@RequestParam String code,HttpServletRequest request){
        if(providerService.findByCode(code)==null) throw new CustomException("Nguồn cung không tồn tại",HttpStatus.NOT_FOUND);
        Provider provider=providerService.findByCode(code);
        receiptController.deleteReceipt(provider);
        providerService.deleteByCode(code);
        String token= request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username+ " đã xóa nguồn cung "+code)
                .build());
    }
}
