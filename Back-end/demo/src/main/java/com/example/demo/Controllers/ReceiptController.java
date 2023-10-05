package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.History;
import com.example.demo.Entities.Receipt;
import com.example.demo.Entities.ReceiptType;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.HistoryService;
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

@RestController
@AllArgsConstructor
public class ReceiptController {
    private ReceiptService receiptService;
    private HistoryService historyService;
    private ReceiptTypeService receiptTypeService;
    private TokenProvider tokenProvider;
    @GetMapping("/receipt/count")
    public long count(){
        return receiptService.count();
    }
    @GetMapping("/receipt/show")
    public List<Receipt> showAll(@RequestBody @Valid Value<String> value, @RequestParam int page){
        return receiptService.listAll(value.getValue(), PageRequest.of(page,10));
    }
    @GetMapping("/receipt/information")
    public Receipt showInformation(@RequestBody Value<String> code){
        return receiptService.findByCode(code.getValue());
    }
    @PostMapping("/admin/receipt")
    public void createReceipt(@RequestBody @Valid Receipt receipt, HttpServletRequest request){
        if(receiptService.findByCode(receipt.getCode())!=null) throw new CustomException("Phiếu thu đã tồn tại",HttpStatus.BAD_REQUEST);
        receipt.setCreated_date(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)));
        receiptService.save(receipt);

        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + " đã tạo ra phiếu thu " + receipt.getCode())
                .build());
    }

    @PutMapping("/admin/receipt")
    @Transactional
    public void updateReceipt(@RequestBody @Valid Receipt receipt, HttpServletRequest request){
        Receipt temp=receiptService.findByCode(receipt.getCode());
        if(temp==null) throw new CustomException("Phiếu thu không tồn tại", HttpStatus.NOT_FOUND);
        temp.setReceipt(receipt);
        receiptService.save(temp);

        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + " đã cập nhật phiếu thu " + receipt.getCode())
                .build());
    }

    @DeleteMapping("/admin/receipt")
    @Transactional
    public void updateReceipt(@RequestBody Value<String> value, HttpServletRequest request){
        if(receiptService.findByCode(value.getValue())==null) throw new CustomException("Phiếu thu không tồn tại",HttpStatus.NOT_FOUND);
        receiptService.deleteByCode(value.getValue());

        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + " đã xóa phiếu thu " + value.getValue())
                .build());
    }
    @GetMapping("/receipt-type/show")
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
