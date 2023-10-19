package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.History;
import com.example.demo.Entities.Provider;
import com.example.demo.Entities.Receipt;
import com.example.demo.Entities.ReceiptType;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.HistoryService;
import com.example.demo.Service.ProviderService;
import com.example.demo.Service.ReceiptService;
import com.example.demo.Service.ReceiptTypeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
public class ReceiptController {
    private ReceiptService receiptService;
    private HistoryService historyService;
    private ReceiptTypeService receiptTypeService;
    private TokenProvider tokenProvider;
    private ProviderService providerService;
    @GetMapping("/receipt/count")
    public long count(){
        return receiptService.count();
    }
    @PostMapping("/receipt/filter")
    public long countFilter(String value){
        return receiptService.countfilter(value);
    }
    @PostMapping("/receipt/show")
    public List<Receipt> showAll(@RequestBody @Valid Value<String> value, @RequestParam int page){
        return receiptService.listAll(value.getValue(), PageRequest.of(page,10));
    }
    @GetMapping("/receipt/information")
    public Receipt showInformation(@RequestParam String code){
        return receiptService.findByCode(code);
    }
    @PostMapping("/admin/receipt")
    public void createReceipt(@RequestBody Receipt receipt, HttpServletRequest request){
        if(receiptService.findByCode(receipt.getCode())!=null) throw new CustomException("Phiếu thu đã tồn tại",HttpStatus.BAD_REQUEST);
        receipt.setCreated_date(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)));
        Provider provider= providerService.findById((long)receipt.getProvider().getId());
        provider.setDebt(provider.getDebt()+receipt.getRevenue());
        receipt.setProvider(provider);
        receiptService.save(receipt);
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + " đã tạo ra phiếu thu " + receipt.getCode())
                .build());
    }

    @PutMapping("/admin/receipt")
    public void updateReceipt(@RequestBody Receipt receipt, HttpServletRequest request){
        Receipt temp=receiptService.findByCode(receipt.getCode());
        if(temp==null) throw new CustomException("Phiếu thu không tồn tại", HttpStatus.NOT_FOUND);
        Provider provider1= providerService.findById((long)temp.getProvider().getId());
        Provider provider2= providerService.findById((long)receipt.getProvider().getId());
        provider1.setDebt(provider1.getDebt()-temp.getRevenue());
        provider2.setDebt(provider2.getDebt()+receipt.getRevenue());
        receipt.setProvider(provider2);
        temp.setReceipt(receipt);
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + " đã cập nhật phiếu thu " + receipt.getCode())
                .build());
    }

    @DeleteMapping("/admin/receipt")
    @Transactional
    public void deleteReceipt(@RequestParam String code, HttpServletRequest request){
        if(receiptService.findByCode(code)==null) throw new CustomException("Phiếu thu không tồn tại",HttpStatus.NOT_FOUND);
        Receipt receipt=receiptService.findByCode(code);
        Provider provider=providerService.findById(receipt.getProvider().getId());
        provider.setDebt(provider.getDebt()-receipt.getRevenue());
        receiptService.deleteByCode(code);
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + " đã xóa phiếu thu " +code  )
                .build());
    }
    @Transactional
    public void deleteReceipt(Provider provider){
        receiptService.deleteByProvder(provider);
    }
    @GetMapping("/admin/receipt-type")
    public List<ReceiptType> findAll(){
        return receiptTypeService.findAll();
    }

    @PostMapping("/admin/receipt-type")
    public void createReceiptType(@RequestBody @Valid ReceiptType receiptType,HttpServletRequest request){
        ReceiptType resource=receiptTypeService.findByName(receiptType.getName());
        if(resource!=null) throw new CustomException("Loại phiếu thu đã tồn tại", HttpStatus.BAD_REQUEST);
        receiptTypeService.save(receiptType);

        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + " đã tạo loại phiếu thu " + receiptType.getName())
                .build());
    }
    @DeleteMapping("/admin/recipt-type")
    @Transactional
    public void deleteReceiptType(@RequestBody @Valid ReceiptType receiptType,HttpServletRequest request){
        ReceiptType resource=receiptTypeService.findByName(receiptType.getName());
        if(resource==null) throw new CustomException("Loại phiếu thu không tồn tại",HttpStatus.NOT_FOUND);
        receiptTypeService.delete(resource);
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + " đã xóa loại phiếu thu " + receiptType.getName())
                .build());
    }
}
