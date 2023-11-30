package com.example.demo.Controller;



import com.example.demo.DataType.Value;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.Provider;
import com.example.demo.Entities.Receipt;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.EmployeeRepo;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.PaymentTypeRepo;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.PaymentTypeService;
import com.example.demo.Service.ProviderService;
import com.example.demo.Service.ReceiptService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/receipt")
@AllArgsConstructor
public class ReceiptController {
    private ReceiptService receiptService;
    private HistoryRepository historyRepository;
    private SequenceRepository sequenceRepository;
    private TokenProvider tokenProvider;
    private EmployeeRepo employeeService;
    private PaymentTypeService paymentTypeService;
    private ProviderService providerService;

    @PostMapping("/list")
    List<Receipt> list(@RequestBody Value<Receipt> value,
                       @RequestParam int page,
                       @RequestParam int limit,
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
        return receiptService.list(value.getValue(),value.getT().getManager(),value.getT().getCreated_date(),value.getT().getPayment_type(),value.getT().getStatus(),value.getT().getReceiptGroup(),PageRequest.of(page,limit,sortObject));
    }
    @PostMapping("/count-list")
    Long countList(@RequestBody Value<Receipt> value,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            value.getT().setManager(t.getUsername());
            value.getT().setManager_code(t.getCode());
        }
        return receiptService.countList(value.getValue(),value.getT().getManager(), value.getT().getCreated_date(),value.getT().getPayment_type(),value.getT().getStatus(),value.getT().getReceiptGroup());
    }
    @GetMapping("information")
    Receipt information(@RequestParam String code,HttpServletRequest request){
        String manager=null;
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            manager=t.getUsername();
        }
        if(receiptService.findByCodeAndManager(code,manager)==null) throw new CustomException("Không tồn tại", HttpStatus.NOT_FOUND);
        return receiptService.findByCodeAndManager(code,manager);
    }
    @PostMapping("information")
    Value<Receipt> information2(@RequestParam String code,HttpServletRequest request){
        String manager=null;
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            manager=t.getUsername();
        }
        if(receiptService.findByCodeAndManager(code,manager)==null) throw new CustomException("Không tồn tại", HttpStatus.NOT_FOUND);
        return new Value<>(receiptService.findByCodeAndManager(code,manager),t.getRole());
    }
    @GetMapping("receipt-list")
    List<Receipt> receipts(String code){
        Provider p=providerService.findByCode(code);
        return receiptService.findByProvider(p);
    }
    @GetMapping("count-trade")
    Long count(){
        return receiptService.countAll();
    }
    @GetMapping("today")
    Long countToday(){
        return receiptService.countToday(new Date(System.currentTimeMillis()));
    }
    @PostMapping("/staff/create-one")
    public void create(@RequestBody Receipt receipt, HttpServletRequest request){
        if (receipt.getCode()==null||receipt.getCode().trim().isEmpty()){
            receipt.setCode("RCV"+sequenceRepository.generate());
        }else if(receipt.getCode().matches("^RCV.*")) throw new CustomException("Tiền tố RCV không hợp lệ", HttpStatus.BAD_REQUEST);
        else if(receiptService.findByCode(receipt.getCode())!=null) throw new CustomException("Phiếu chi đã tồn tại",HttpStatus.BAD_REQUEST);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        receipt.setPayment_type(paymentTypeService.findByName(receipt.getPayment_type().getName()));
        receipt.setProvider_name(receipt.getProvider().getName()+"-"+receipt.getProvider().getCode());
        receipt.setCreated_date(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)));
        receipt.setCreated_date1(new Timestamp(System.currentTimeMillis()));
        receipt.setManager_code(t.getCode());
        receipt.setManager(t.getUsername());
        receiptService.save(receipt);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra phiếu chi "+receipt.getCode());
    }
    @PutMapping ("/staff")
    void update(@RequestBody Receipt receipt, HttpServletRequest request){
        receiptService.update(receipt);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã cập nhật phiếu chi "+receipt.getCode());
    }
    @DeleteMapping("/admin")
    @Transactional
    public void delete(@RequestBody List<String> list,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        receiptService.deleteAllByCode(list);
        for(String i:list){
            historyRepository.save(t.getCode(),t.getName(),"đã xóa phiếu chi "+i);
        }
    }

}
