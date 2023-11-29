package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.Payment;
import com.example.demo.Entities.PaymentType;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.EmployeeRepo;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.CustomerService;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.PaymentService;
import com.example.demo.Service.PaymentTypeService;
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
@RequestMapping("/payment")
@AllArgsConstructor
@Transactional
public class PaymentController {
    private PaymentService paymentService;
    private HistoryRepository historyRepository;
    private SequenceRepository sequenceRepository;
    private TokenProvider tokenProvider;
    private EmployeeService employeeService;
    private CustomerService customerService;
    private PaymentTypeService paymentTypeService;
    @PostMapping("/list")
    List<Payment> list(@RequestBody Value<Payment> value,
                       @RequestParam(name="page",required = false,defaultValue = "0") int page,
                       @RequestParam(name="limit",required = false,defaultValue = "10") int limit,
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
        if(value.getT().getCustomer()!=null){
            System.out.println("s");
            Customer customer=customerService.findByCode(value.getT().getCustomer().getCode());
            return paymentService.findByCustomer(customer);
        }
        else return paymentService.list(value.getValue(),
                value.getT().getManager(),
                value.getT().getCreated_date(),
                value.getT().getPaymentType(),
                value.getT().getStatus(),
                value.getT().getPaymentGroup(),
                PageRequest.of(page,limit,sortObject));
    }
    @PostMapping("/count-list")
    Long countList(@RequestBody Value<Payment> value,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            value.getT().setManager(t.getUsername());
            value.getT().setManager_code(t.getCode());
        }
        return paymentService.countList(value.getValue(),
                value.getT().getManager(),
                value.getT().getCreated_date(),
                value.getT().getPaymentType(),
                value.getT().getStatus(),
                value.getT().getPaymentGroup());
    }
    @GetMapping("/count-trade")
    Long count(){
        return paymentService.countAll();
    }
    @GetMapping("information")
    Payment information(@RequestParam String code,HttpServletRequest request){
        String manager=null;
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            manager=t.getUsername();
        }
        if(paymentService.findByCode(code)==null) throw new CustomException("Không tồn tại", HttpStatus.NOT_FOUND);
        return paymentService.findByCodeAndManager(code,manager);
    }
    @GetMapping("today")
    Long countToday(){
        return paymentService.countToday(new Date(System.currentTimeMillis()));
    }
    @PostMapping("/staff/create-one")
    public void create(@RequestBody Payment payment, HttpServletRequest request){
        System.out.println(payment);
        if(paymentService.findByCode(payment.getCode())!=null) throw new CustomException("Phiếu chi đã tồn tại",HttpStatus.BAD_REQUEST);
        if (payment.getCode()==null||payment.getCode().trim().isEmpty()){
            payment.setCode("PMT"+sequenceRepository.generate());
        }else if(payment.getCode().matches("^PMT.*")) throw new CustomException("Tiền tố PMT không hợp lệ", HttpStatus.BAD_REQUEST);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        String code=payment.getCustomer().getCode();
        Customer customer=customerService.findByCode(code);
        System.out.println(payment.getPaymentType());
                payment.setPaymentType(paymentTypeService.findByName(payment.getPaymentType().getName()));
        payment.setCustomer(customerService.findByCode(payment.getCustomer().getCode()));
        payment.setCreated_date(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)));
        payment.setCreated_date1(new Timestamp(System.currentTimeMillis()));
        payment.setManager(t.getUsername());
        payment.setManager_code(t.getCode());
        paymentService.save(payment);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra phiếu chi "+payment.getCode());
    }
    @PutMapping ("/admin")
    void update(@RequestBody Payment payment, HttpServletRequest request){
        paymentService.update(payment);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã cập nhật phiếu chi "+payment.getCode());
    }
    @DeleteMapping("/admin")
    @Transactional
    public void delete(@RequestBody List<String> list,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        paymentService.deleteAllByCode(list);
        for(String i:list){
            historyRepository.save(t.getCode(),t.getName(),"đã xóa phiếu chi "+i);
        }
    }

}
