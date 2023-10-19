package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Customer;
import com.example.demo.Entities.History;
import com.example.demo.Entities.Payment;
import com.example.demo.Entities.PaymentType;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.CustomerService;
import com.example.demo.Service.HistoryService;
import com.example.demo.Service.PaymentService;
import com.example.demo.Service.PaymentTypeService;
import jakarta.persistence.Transient;
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
public class PaymentController {
    PaymentService paymentService;
    HistoryService historyService;
    CustomerService customerService;
    PaymentTypeService paymentTypeService;
    TokenProvider tokenProvider;
    @GetMapping("/payment/count")
    public long count(){
        return paymentService.count();
    }
    @PostMapping("/payment/filter")
    public long countFilter(String value){
        return paymentService.countfilter(value);
    }
    @PostMapping("/payment/show")
    List<Payment> showAllPayment(@RequestBody Value<String> value, @RequestParam int page){
        return paymentService.listAll(value.getValue(), PageRequest.of(page,10));
    }
    @GetMapping("/payment/information")
    Payment paymentInformation(@RequestParam String code){
        System.out.println(code==null);
        return paymentService.findByCode(code);
    }
    @PostMapping("/admin/payment")
    public void createPayment(@RequestBody Payment payment, HttpServletRequest request){
        if(paymentService.findByCode(payment.getCode())!=null) throw new CustomException("Phiếu chi này đã tồn tại", HttpStatus.BAD_REQUEST);
        payment.setCreated_date(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)));
        payment.setCreated_date1(new Timestamp(System.currentTimeMillis()));
        Customer customer=customerService.findById(payment.getCustomer().getId());
        Set<Payment> payments=new HashSet<>();
        payments.add(payment);
        customer.setPayments(payments);
        customer.setDebt(customer.getDebt()+payment.getPaid());
        paymentService.save(payment);
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(payment.getCreated_date())
                .msg(username + "đã tạo ra phiếu chi " + payment.getCode())
                .build());
    }
    @PutMapping("/admin/payment")
    void updatePayment(@RequestBody Payment payment,HttpServletRequest request){
        Payment temp=paymentService.findByCode(payment.getCode());
        if(temp==null) throw new CustomException("Phiếu chi này không tồn tại",HttpStatus.NOT_FOUND);
        Customer customer1=customerService.findByCode(temp.getCustomer().getCode());
        Customer customer2=customerService.findByCode(payment.getCustomer().getCode());
        customer1.setDebt(customer1.getDebt()-temp.getPaid());
        customer2.setDebt(customer2.getDebt()+payment.getPaid());
        temp.setPayment(payment);
        paymentService.save(temp);
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(payment.getCreated_date())
                .msg(username + "đã cập nhật phiếu chi " + payment.getCode())
                .build());
    }
    @DeleteMapping("/admin/payment")
    @Transactional
    public void deletePayment(@RequestParam String code, HttpServletRequest request){
        if(paymentService.findByCode(code)==null) throw new CustomException("Phiếu chi này không tồn tại",HttpStatus.NOT_FOUND);
        Payment payment=paymentService.findByCode(code);
        Customer customer=customerService.findByCode(payment.getCustomer().getCode());
        customer.setDebt(customer.getDebt()-payment.getPaid());
        paymentService.deleteByCode(code);

        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + "đã cập nhật phiếu chi " + code)
                .build());
    }
    @Transactional
    public void deletePayment(Customer customer){
        paymentService.deleteByCustomer(customer);
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
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + "đã tạo ra loại phiếu chi " + paymentType.getName())
                .build());
    }
    @DeleteMapping("/admin/payment-type")
    void deletePaymentType(@RequestBody Value<String> value,HttpServletRequest request){
        if(paymentTypeService.findByName(value.getValue())!=null) throw new CustomException("Loại chi phiếu này đã tồn tại", HttpStatus.BAD_REQUEST);
        paymentTypeService.deleteByName(value.getValue());
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .msg(username + "đã xóa loại phiếu chi " + value.getValue())
                .build());
    }
}
