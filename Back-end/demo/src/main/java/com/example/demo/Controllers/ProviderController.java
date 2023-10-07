package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.History;
import com.example.demo.Entities.Provider;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.HistoryService;
import com.example.demo.Service.ProviderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@AllArgsConstructor
public class ProviderController {
    HistoryService historyService;
    ProviderService providerService;
    TokenProvider tokenProvider;
    @GetMapping("/provider/count")
    public long count(){
        return providerService.count();
    }
    @PostMapping("/provider/show")      
    @ResponseStatus(HttpStatus.OK)
    public List<Provider> showAll(@RequestBody Value<Provider> value, @RequestParam int page){
        System.out.println(value.getT());
        return providerService.listAll(value, PageRequest.of(page,10));
    }
    @GetMapping("/provider/inform")
    @ResponseStatus(HttpStatus.OK)
    public Provider showInformation(@RequestBody @Valid Value<String> value){
        return providerService.findByCode(value.getValue());
    }
    @PostMapping("/admin/provider")
    @ResponseStatus(HttpStatus.CREATED)
    public void createProvider(@RequestBody @Valid Provider provider, HttpServletRequest request){
        if(providerService.findByCode(provider.getCode())!=null) throw new CustomException("Nguồn cung đã tồn tại",HttpStatus.BAD_REQUEST);
        if(provider.getContact().matches("\\D")) throw new CustomException("Số điện thoại không hợp lệ",HttpStatus.BAD_REQUEST);
        provider.setCreated_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        providerService.save(provider);
        String token= request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username+ " đã tạo ra nguồn cung "+provider.getCode())
                .build());
    }
    @PutMapping("/admin/provider")
    @ResponseStatus(HttpStatus.OK)
    public void updateProvider(@RequestBody @Valid Provider provider, HttpServletRequest request){
        Provider temp=providerService.findByCode(provider.getCode());
        if(temp==null) throw new CustomException("Nguồn cung không tồn tại",HttpStatus.NOT_FOUND);
        if(provider.getContact().matches("\\D")) throw new CustomException("Số điện thoại không hợp lệ",HttpStatus.BAD_REQUEST);
        provider.setModified_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        temp.setProvider(provider);
        providerService.save(temp);
        String token= request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username+ " đã cập nhật nguồn cung "+provider.getCode())
                .build());
    }
    
    @DeleteMapping("admin/provider")
    @Transactional
    @ResponseStatus(HttpStatus.OK)
    public void deleteProvider(@RequestBody @Valid Value<String> value,HttpServletRequest request){
        if(providerService.findByCode(value.getValue())==null) throw new CustomException("Nguồn cung không tồn tại",HttpStatus.NOT_FOUND);
        providerService.deleteByCode(value.getValue());
        String token= request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username+ " đã xóa nguồn cung "+value.getValue())
                .build());
    }
}
