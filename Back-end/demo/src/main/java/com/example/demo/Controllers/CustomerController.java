package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Customer;
import com.example.demo.Entities.CustomerType;
import com.example.demo.Entities.History;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.CustomerService;
import com.example.demo.Service.CustomerTypeService;
import com.example.demo.Service.HistoryService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@AllArgsConstructor
public class CustomerController {
    CustomerService customerService;
    CustomerTypeService customerTypeService;
    HistoryService historyService;
    TokenProvider tokenProvider
    // Show danh sách khách hàng
    @GetMapping("/customer/count")
    public long count(){
        return customerService.count();
    }
    @PostMapping("customer/show")
    @ResponseStatus(HttpStatus.OK)
    public List<Customer> showAll(@RequestBody Value<Customer> value, @RequestParam int page){
       return customerService.findAll(value.getValue(),
               value.getT().getBirthday_day(),
               value.getT().getBirthday_month(),
               value.getT().getBirthday_year(),
               value.getT().getGender(),
               PageRequest.of(page,10));
    }
    //show thông tin cá nhân khách hàng
    @GetMapping("customer/information/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Customer show(@PathVariable long id){
        return customerService.findById(id);
    }
    //tạo ra 1 khách hàng
    @PostMapping("/admin/customer")
    @ResponseStatus(HttpStatus.CREATED)
    public void createCustomer(@RequestBody @Valid Customer customer,@RequestBody String token){
        //Tạo mới
        if(customerService.findByCode(customer.getCode())!=null) throw new CustomException("Khách hàng này đã được tạo",HttpStatus.BAD_REQUEST);
        if(customer.getContact().trim().matches("\\D")) throw new CustomException("Số điện thoại không hợp lệ",HttpStatus.BAD_REQUEST);
        customer.setCreate_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        customerService.save(customer);
        //Save vào lịch sử
        String name=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                        .msg(name+" đã tạo ra khách hàng:" + customer.getCode())
                        .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .build());
        CustomerType c=customerTypeService.findByName(customer.getCustomerType().getName());
        c.setMember(c.getMember()+1);
        customerTypeService.save(c);
    }
    //thay đổi thông tin khách hàng
    @PutMapping("/admin/customer")
    @ResponseStatus(HttpStatus.OK)
    public void updateCustomer(@RequestBody @Valid Customer customer, @RequestBody String token){
        Customer temp=customerService.findByCode(customer.getCode());
        if(temp==null) throw new CustomException("Khách hàng này không tồn tại",HttpStatus.NOT_FOUND);
        if(customer.getContact().matches("\\D")) throw new CustomException("Số điện thoại không hợp lệ",HttpStatus.BAD_REQUEST);
        if(temp.getCustomerType()!=customer.getCustomerType()){
            CustomerType a =customerTypeService.findByName(temp.getCustomerType().getName());
            a.setMember(a.getMember()-1);
            customerTypeService.save(a);
            CustomerType b =customerTypeService.findByName(customer.getCustomerType().getName());
            b.setMember(b.getMember()+1);
        }
        temp.setCustomer(customer);
        temp.setModified_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        customerService.save(temp);
        String name=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                .msg(name+" đã cập nhật khách hàng:" + customer.getCode())
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .build());
    }
    //xóa khách hàng
    @DeleteMapping("/admin/delete-customer")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void deleteCustomer(@RequestBody String code,@RequestBody String token){
        Customer temp=customerService.findByCode(code);
        if(temp==null) throw new CustomException("Khách hàng này không tồn tại",HttpStatus.NOT_FOUND);
        customerService.deleteByCode(code);
        String name=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                .msg(name+" đã xóa khách hàng " + code)
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .build());
    }
    @PostMapping("/admin/create-type")
    @ResponseStatus(HttpStatus.CREATED)
    public void createType(@RequestBody @Valid CustomerType customerType, @RequestBody String token){
        if(customerTypeService.findByName(customerType.getName())!=null) throw new CustomException("Loại khách hàng này đã tồn tại",HttpStatus.BAD_REQUEST);
        customerType.setCreated_date(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)));
        customerTypeService.save(customerType);
        historyService.save(History.builder()
                .msg(tokenProvider.extractUsername(token) + " đã tạo ra loại khách hàng:" + customerType.getName())
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .build());
    }
    @GetMapping("customer/show/type/{page}")
    @ResponseStatus(HttpStatus.OK)
    public Page<CustomerType> showAll(@PathVariable int page){
        return customerTypeService.findAll(PageRequest.of(page,5));
    }
    @DeleteMapping("/admin/delete-type")
    @ResponseStatus(HttpStatus.OK)
    public void deleteTypeByName(@RequestBody String name,@RequestBody String token){
        CustomerType temp=customerTypeService.findByName(name);
        if(temp==null) throw new CustomException("Loại khách hàng này không tồn tại",HttpStatus.NOT_FOUND);
        customerTypeService.deleteByName(name);
        String guy=tokenProvider.extractUsername(token);
        historyService.save(History.builder()
                .msg(guy+" đã xóa loại khách hàng:" + name)
                .time(new Timestamp(System.currentTimeMillis()+(1000*60*60*7)))
                .build());
    }
}
