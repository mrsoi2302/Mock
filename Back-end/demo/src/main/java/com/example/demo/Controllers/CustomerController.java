package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Customer;
import com.example.demo.Entities.CustomerType;
import com.example.demo.Entities.Employee;
import com.example.demo.Entities.History;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
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
public class CustomerController {
    CustomerService customerService;
    CustomerTypeService customerTypeService;
    HistoryService historyService;
    TokenProvider tokenProvider;
    EmployeeService employeeService;
    PaymentController paymentController;
    // Show danh sách khách hàng
    @GetMapping("/customer/count")
    public long count(){
        long count = customerService.count();
        return count;
    }
    @PostMapping("customer/show")
    @ResponseStatus(HttpStatus.OK)
    public List<Customer> showAll(@RequestBody Value<Customer> value, @RequestParam int page){
        System.out.println(value);
       return customerService.findAll(value.getValue(),
               value.getT().getStatus(),
               value.getT().getCreated_date(),
               value.getT().getBirthday_day(),
               value.getT().getBirthday_month(),
               value.getT().getBirthday_year(),
               value.getT().getGender(),
               PageRequest.of(page,10),
               value.getT().getCustomerType());
    }
    @PostMapping("customer/filter")
    @ResponseStatus(HttpStatus.OK)
    public long countAll(@RequestBody Value<Customer> value){
        return customerService.countAll(value.getValue(),
                value.getT().getStatus(),
                value.getT().getCreated_date(),
                value.getT().getBirthday_day(),
                value.getT().getBirthday_month(),
                value.getT().getBirthday_year(),
                value.getT().getGender(),
                value.getT().getCustomerType());
    }
    //show thông tin cá nhân khách hàng
    @GetMapping("customer/information")
    @ResponseStatus(HttpStatus.OK)
    public Customer show(@RequestParam String code){
        return customerService.findByCode(code);
    }
    //tạo ra 1 khách hàng
    @PostMapping("/admin/customer")
    @ResponseStatus(HttpStatus.CREATED)
    public void createCustomer(@RequestBody Customer customer, HttpServletRequest request){
        //Tạo mới
        if(customerService.findByCode(customer.getCode())!=null) throw new CustomException("Khách hàng này đã được tạo",HttpStatus.BAD_REQUEST);
        if(!customer.getContact().matches("^\\d+$")) throw new CustomException("Số điện thoại không hợp lệ",HttpStatus.BAD_REQUEST);
        customer.setCreated_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        String username=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        Set<Employee> set=new HashSet<>();
        Employee employee= employeeService.findByUsername(username);
        set.add(employee);
        customer.setEmployees(set);
        customerService.save(customer);
        //Save vào lịch sử
        historyService.save(History.builder()
                        .msg(username+" đã tạo ra khách hàng:" + customer.getCode())
                        .time(new Timestamp(System.currentTimeMillis()))
                .build());
        CustomerType c=customerTypeService.findById((long)customer.getCustomerType().getId());
        c.setMember(c.getMember()+1);
        customerTypeService.save(c);
    }
    //thay đổi thông tin khách hàng
    @GetMapping("/customer/findall")
    List<Customer> customerList(){
        return customerService.findAll();
    }
    @PutMapping("/admin/customer")
    @ResponseStatus(HttpStatus.OK)
    public void updateCustomer(@RequestBody Customer customer, HttpServletRequest request){
        Customer temp=customerService.findByCode(customer.getCode());
        if(temp==null) throw new CustomException("Khách hàng này không tồn tại",HttpStatus.NOT_FOUND);
        if(customer.getContact().matches("\\D")) throw new CustomException("Số điện thoại không hợp lệ",HttpStatus.BAD_REQUEST);
        if(temp.getCustomerType()!=customer.getCustomerType()){
            CustomerType a =customerTypeService.findById(temp.getCustomerType().getId());
            a.setMember(a.getMember()-1);
            customerTypeService.save(a);
            CustomerType b =customerTypeService.findById((long)customer.getCustomerType().getId());
            b.setMember(b.getMember()+1);
        }
        temp.setCustomer(customer);
        temp.setModified_date(new Date(System.currentTimeMillis()));
        customerService.save(temp);
        String name=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .msg(name+" đã cập nhật khách hàng:" + customer.getCode())
                .time(new Timestamp(System.currentTimeMillis()))
                .build());
    }
    @DeleteMapping("/admin/customer")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void deleteCustomer(@RequestParam String code,HttpServletRequest request){
        Customer customer=customerService.findByCode(code);
        paymentController.deletePayment(customer);
        if(customerService.findByCode(code)==null) throw new CustomException("Khách hàng này không tồn tại",HttpStatus.NOT_FOUND);
        CustomerType b =customerTypeService.findById(customer.getCustomerType().getId());
        b.setMember(b.getMember()-1);

        String name=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .msg(name+" đã xóa khách hàng " + code)
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .build());
    }
    @DeleteMapping("/admin/customer/deohieu")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void deleteCustomer(@RequestParam String code){
        customerService.deleteByCode(code);
    }
    @PostMapping("/admin/create-type")
    @ResponseStatus(HttpStatus.CREATED)
    public void createType(@RequestBody @Valid CustomerType customerType, HttpServletRequest request){
        if(customerTypeService.findByName(customerType.getName())!=null) throw new CustomException("Loại khách hàng này đã tồn tại",HttpStatus.BAD_REQUEST);
        customerType.setCreated_date(new Timestamp(System.currentTimeMillis()));
        customerTypeService.save(customerType);
        historyService.save(History.builder()
                .msg(tokenProvider.extractUsername(request.getHeader("Authorization").substring(7)) + " đã tạo ra loại khách hàng:" + customerType.getName())
                .time(new Timestamp(System.currentTimeMillis()))
                .build());
    }
    @GetMapping("customer-type/count")
    public long typeCount(){
        return customerTypeService.count();
    }
    @GetMapping("customer-type/show")
    @ResponseStatus(HttpStatus.OK)
    public List<CustomerType> showAll(@RequestParam int page){
        return customerTypeService.findAll(PageRequest.of(page,5));
    }
    @GetMapping("customer-type/show-all")
    public List<CustomerType> list(){
        return customerTypeService.findAll();
    }
    @DeleteMapping("/admin/delete-type")
    @Transactional
    @ResponseStatus(HttpStatus.OK)
    public void deleteTypeByName(@RequestBody String name,HttpServletRequest request){
        CustomerType temp=customerTypeService.findByName(name);
        if(temp==null) throw new CustomException("Loại khách hàng này không tồn tại",HttpStatus.NOT_FOUND);
        customerTypeService.deleteByName(name);
        String guy=tokenProvider.extractUsername(request.getHeader("Authorization").substring(7));
        historyService.save(History.builder()
                .msg(guy+" đã xóa loại khách hàng:" + name)
                .time(new Timestamp(System.currentTimeMillis()))
                .build());
    }
}
