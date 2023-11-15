package com.example.demo.Controller;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Employee;
import com.example.demo.Exceptions.CustomException;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import com.example.demo.Repositories.SequenceRepo.SequenceRepository;
import com.example.demo.Security.TokenProvider;
import com.example.demo.Service.CustomerService;
import com.example.demo.Service.EmployeeService;
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
@RequestMapping("/customer")
@AllArgsConstructor
public class CustomerController {
    private CustomerService customerService;
    private SequenceRepository sequenceRepository;
    private TokenProvider tokenProvider;
    private EmployeeService employeeService;
    private HistoryRepository historyRepository;

    @PostMapping("/list")
    List<Customer> list(@RequestBody Value<Customer> value,
                        @RequestParam(name = "page") int page,
                        @RequestParam(name="limit") int limit,
                        @RequestParam(name="sort",required = false,defaultValue = "created_date-desc") String sort,
                        HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            value.getT().setManager(t.getUsername());
            value.getT().setManager_code(t.getCode());
        }
        System.out.println(value);
        String[] sortParams=sort.split("-");
        sortParams[1]=sortParams[1].equals("ascend")? "asc":"desc";
        Sort.Direction sortOrder=sortParams[1].equals("asc")? Sort.Direction.ASC: Sort.Direction.DESC;
        Sort sortObject=Sort.by(sortOrder,sortParams[0]);
        return customerService.list(value.getValue(),
                value.getT().getManager(),
                value.getT().getBirthday_day(),
                value.getT().getBirthday_month(),
                value.getT().getBirthday_year(),
                value.getT().getStatus(),
                value.getT().getGender(),
                PageRequest.of(page,limit,sortObject));
    }
    @PostMapping("/count-list")
    Long list(@RequestBody Value<Customer> value, HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            value.getT().setManager(t.getUsername());
            value.getT().setManager_code(t.getCode());
        }
        return customerService.countList(value.getValue(),
                value.getT().getManager(),
                value.getT().getBirthday_day(),
                value.getT().getBirthday_month(),
                value.getT().getBirthday_year(),
                value.getT().getStatus(),
                value.getT().getGender());
    }
    @GetMapping("/information")
    public Customer information(@RequestParam String code,HttpServletRequest request){
        String manager=null;
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            manager=t.getUsername();
        }
        if(customerService.findByCodeAndManager(code,manager)==null) throw new CustomException("Không tồn tại", HttpStatus.NOT_FOUND);
        return customerService.findByCode(code);
    }
    @PostMapping("staff/create-one")
    public void create(@RequestBody Customer customer, HttpServletRequest request){
        if(!customer.getContact().matches("^[0-9]+$\n")) throw new CustomException("SĐT không hợp lệ",HttpStatus.BAD_REQUEST);
        if(!customer.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) throw new CustomException("Email không hợp lệ", HttpStatus.BAD_REQUEST);
        if(customer.getCode()==null){
            customer.setCode("CTM"+sequenceRepository.generate());
        }else if(customer.getCode().matches("^CTM.*")) throw new CustomException("Tiền tố CTM không hợp lệ", HttpStatus.BAD_REQUEST);
        else if(customerService.findByCode(customer.getCode())!=null) throw new CustomException("KH đã tồn tại",HttpStatus.BAD_REQUEST);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        customer.setManager(t.getUsername());
        customer.setCreated_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
        customer.setCreated_date1(new Date(System.currentTimeMillis()));
        customerService.save(customer);
        historyRepository.save(t.getCode(),t.getName(),"đã tạo ra khách hàng "+customer.getCode());
    }
    @PostMapping("staff/create-many")
    public void createAll(@RequestBody List<Customer> list,HttpServletRequest request){
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        for(Customer i:list){
            int index=list.indexOf(i);
            if(!i.getContact().matches("^[0-9]+$\n")) throw new CustomException("SĐT không hợp lệ",HttpStatus.BAD_REQUEST);
            if(!i.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) throw new CustomException("Email không hợp lệ", HttpStatus.BAD_REQUEST);
            if (i.getCode()==null){
                i.setCode("CTM"+sequenceRepository.generate());
            }else if(i.getCode().matches("^CTM.*")) throw new CustomException("Tiền tố CTM không hợp lệ", HttpStatus.BAD_REQUEST);
            else if(customerService.findByCode(i.getCode())!=null) throw new CustomException("KH đã tồn tại",HttpStatus.BAD_REQUEST);
            i.setManager(t.getUsername());
            i.setCreated_date(new Date(System.currentTimeMillis()+(1000*60*60*7)));
            i.setCreated_date1(new Date(System.currentTimeMillis()));
            list.set(index,i);

        }
        customerService.saveAll(list);
        for(Customer i:list){
            historyRepository.save(t.getCode(),t.getName(),"đã tạo ra khách hàng "+i.getCode());
        }
    }
    @PutMapping("/admin")
    public void update(@RequestBody Customer customer,HttpServletRequest request){
        if(!customer.getContact().matches("^[0-9]+$\n")) throw new CustomException("SĐT không hợp lệ",HttpStatus.BAD_REQUEST);
        if(!customer.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) throw new CustomException("Email không hợp lệ", HttpStatus.BAD_REQUEST);
        customerService.update(customer);
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        historyRepository.save(t.getCode(),t.getName(),"đã cập nhật khách hàng "+customer.getCode());
    }
    @PostMapping("/create-payment")
    public List<Customer> forCreatePayment(HttpServletRequest request){
        String manager=null;
        String token = request.getHeader("Authorization").substring(7);
        String username=tokenProvider.extractUsername(token);
        Employee t=employeeService.findByUsername(username);
        if(t.getRole().equals("STAFF")){
            manager=t.getUsername();
        }
        return customerService.findForPayment(manager);
    }
    @DeleteMapping("/admin")
    @Transactional
    public void delete(@RequestBody List<String> list,HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String username = tokenProvider.extractUsername(token);
        Employee t = employeeService.findByUsername(username);
        customerService.deleteAllByCode(list);
        for (String i : list) {
            historyRepository.save(t.getCode(), t.getName(), "đã xóa khách hàng " + i);
        }
    }
}