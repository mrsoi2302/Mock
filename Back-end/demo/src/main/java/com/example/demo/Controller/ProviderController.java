package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.Provider;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.ProviderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/provider")
@AllArgsConstructor
public class ProviderController {
    private final ProviderService providerService;
    private TokenProvider tokenProvider;
    private HistoryRepository historyRepository;
    private EmployeeService employeeService;
    private SequenceRepository sequenceRepository;

    @PostMapping("/list")
    public List<Provider> list(@RequestBody(required = false) Value<Provider> value,
                               @RequestParam(name = "page") int page,
                               @RequestParam(name = "limit")int limit,
                               @RequestParam(name="sort",required = false,defaultValue = "created_date-desc") String sort,
                               HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            value.getT().setManager(t.getUsername());
            value.getT().setManager_code(t.getCode());
        }
        String[] sortParams=sort.split("-");
        sortParams[1]=sortParams[1].equals("ascend")? "asc":"desc";
        Sort.Direction sortOrder=sortParams[1].equals("asc")? Sort.Direction.ASC: Sort.Direction.DESC;
        Sort sortObject=Sort.by(sortOrder,sortParams[0]);
        return providerService.list(value.getValue(),value.getT().getManager(),value.getT().getCreated_date(),value.getT().getProvider_type().getContent(),value.getT().getStatus(), PageRequest.of(page,limit,sortObject));
    }
    @PostMapping("/count-list")
    public Long countList(@RequestBody Value<Provider> value,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            value.getT().setManager(t.getUsername());
            value.getT().setManager_code(t.getCode());
        }
        return providerService.countList(value.getValue(),value.getT().getManager(),value.getT().getCreated_date(),value.getT().getProvider_type().getContent(),value.getT().getStatus());
    }
    @PostMapping("/staff/create-one")
    public void create(@RequestBody Provider provider, HttpServletRequest request){
        if(!provider.getContact().matches("^\\d+$")) throw new CustomException("SĐT không hợp lệ",HttpStatus.BAD_REQUEST);
        if(!provider.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) throw new CustomException("Email không hợp lệ", HttpStatus.BAD_REQUEST);
        if (provider.getCode()==null||provider.getCode().isEmpty()){
            provider.setCode("PRV"+sequenceRepository.generate());
        }else if(provider.getCode().matches("^PRV.*")) throw new CustomException("Tiền tố PRV không hợp lệ", HttpStatus.BAD_REQUEST);
        else if(providerService.findByCode(provider.getCode())!=null) throw new CustomException("NCC đã tồn tại",HttpStatus.BAD_REQUEST);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        provider.setManager(t.getUsername());
        provider.setCreated_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        provider.setCreated_date1(new Date(System.currentTimeMillis()));
        providerService.save(provider);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra nhà cung cấp "+provider.getCode());
    }
    @PostMapping("/staff/create-many")
    public void createAll(@RequestBody List<Provider> list,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        for(Provider i:list){
            int index=list.indexOf(i);
            if(!i.getContact().matches("^\\d+$")) throw new CustomException("SĐT không hợp lệ",HttpStatus.BAD_REQUEST);
            if(!i.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) throw new CustomException("Email không hợp lệ", HttpStatus.BAD_REQUEST);
            if (i.getCode()==null){
                i.setCode("PRV"+sequenceRepository.generate());
            }else if(i.getCode().matches("^PRV.*")) throw new CustomException("Tiền tố PRV không hợp lệ", HttpStatus.BAD_REQUEST);
            else if(providerService.findByCode(i.getCode())!=null) throw new CustomException("NCC đã tồn tại",HttpStatus.BAD_REQUEST);
            i.setCreated_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
            i.setCreated_date1(new Date(System.currentTimeMillis()));
            i.setManager(t.getUsername());
            list.set(index,i);
        }
        providerService.saveAll(list);
        for(Provider i:list){
            historyRepository.save(t.getCode(),t.getName(),"đã tạo ra nhà cung cấp "+i.getCode());
        }
    }
    @GetMapping("/information")
    public Provider information(@RequestParam String code,HttpServletRequest request){
        String manager=null;
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            manager=t.getUsername();
        }
        if(providerService.findByCodeAndManager(code,manager)==null) throw new CustomException("Không tồn tại",HttpStatus.NOT_FOUND);
        return providerService.findByCodeAndManager(code,manager);
    }
    @PutMapping ("/admin")
    void update(@RequestBody Provider provider,HttpServletRequest request){
        if(!provider.getContact().matches("^\\d+$")) throw new CustomException("SĐT không hợp lệ",HttpStatus.BAD_REQUEST);
        if(!provider.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) throw new CustomException("Email không hợp lệ", HttpStatus.BAD_REQUEST);
        providerService.update(provider);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã cập nhật nhà cung cấp "+provider.getCode());
    }
    @DeleteMapping("/admin")
    @Transactional
    public void delete(@RequestBody List<String> list,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        providerService.deleteAllByCode(list);
        for(String i:list){
            historyRepository.save(t.getCode(),t.getName(),"đã xóa nhà cung cấp "+i);
        }
    }
    @PostMapping("/create-receipt")
    public List<Provider> forCreateReceipt(HttpServletRequest request){
        String manager=null;
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            manager=t.getUsername();
        }
        return providerService.findForReceipt(manager);
    }
}
