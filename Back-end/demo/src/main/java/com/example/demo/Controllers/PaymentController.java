package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.History;
import com.example.demo.Entities.Payment;
import com.example.demo.Entities.PaymentType;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.HistoryService;
import com.example.demo.Service.PaymentService;
import com.example.demo.Service.PaymentTypeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@AllArgsConstructor
public class PaymentController {
    PaymentService paymentService;
    HistoryService historyService;
    PaymentTypeService paymentTypeService;
    TokenProvider tokenProvider;

    @GetMapping("/payment/show")
    List<Payment> showAllPayment(@RequestBody Value<String> value, @RequestParam int page){
        return paymentService.listAll(value.getValue(), PageRequest.of(page,10));
    }
    @GetMapping("/payment/information")
    Payment paymentInformation(@RequestBody Value<String> value){
        return paymentService.findByCode(value.getValue());
    }
    @PostMapping("/admin/payment")
    void createPayment(@RequestBody @Valid Payment payment, HttpServletRequest request){
        if(paymentService.findByCode(payment.getCode())!=null) throw new CustomException("Phiếu chi này đã tồn tại", HttpStatus.BAD_REQUEST);
        payment.setCreated_date(new Timestamp(System.currentTimeMillis()));
        paymentService.save(payment);

        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(payment.getCreated_date())
                .msg(username + "đã tạo ra phiếu chi " + payment.getCode())
                .build());
    }
    @PutMapping("/admin/payment")
    void updatePayment(@RequestBody @Valid Payment payment,HttpServletRequest request){
        Payment temp=paymentService.findByCode(payment.getCode());
        if(temp==null) throw new CustomException("Phiếu chi này không tồn tại",HttpStatus.NOT_FOUND);
        temp.setPayment(payment);
        paymentService.save(temp);
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(payment.getCreated_date())
                .msg(username + "đã cập nhật phiếu chi " + payment.getCode())
                .build());
    }
    @DeleteMapping("/admin/payment")
    void deletePayment(@RequestBody Value<String> value,HttpServletRequest request){
        if(paymentService.findByCode(value.getValue())==null) throw new CustomException("Phiếu chi này không tồn tại",HttpStatus.NOT_FOUND);
        paymentService.deleteByCode(value.getValue());

        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()))
                .msg(username + "đã cập nhật phiếu chi " + value.getValue())
                .build());
    }
    @GetMapping("/admin/payment-type")
    List<PaymentType> showAllPaymentType(){
        return paymentTypeService.findAll();
    }
    @PostMapping("/admin/payment-type")
    void createPaymentType(@RequestBody @Valid PaymentType paymentType,HttpServletRequest request){
        if(paymentTypeService.findByName(paymentType.getName())!=null) throw new CustomException("Loại chi phiếu này đã tồn tại",HttpStatus.BAD_REQUEST);
        paymentTypeService.save(paymentType);
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()))
                .msg(username + "đã tạo ra loại phiếu chi " + paymentType.getName())
                .build());
    }
    @DeleteMapping("/admin/payment-type")
    void deletePaymentType(@RequestBody Value<String> value,HttpServletRequest request){
        if(paymentTypeService.findByName(value.getValue())!=null) throw new CustomException("Loại chi phiếu này đã tồn tại", HttpStatus.BAD_REQUEST);
        paymentTypeService.deleteByName(value.getValue());
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()))
                .msg(username + "đã xóa loại phiếu chi " + value.getValue())
                .build());
    }
}
