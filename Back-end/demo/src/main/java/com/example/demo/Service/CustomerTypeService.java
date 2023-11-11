package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.CustomerType;
import com.example.demo.Repositories.CustomerTypeRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CustomerTypeService {
    private final CustomerTypeRepo customerTypeRepo;
    private final CustomerService customerService;
    public List<CustomerType> list(String value) {
        return customerTypeRepo.list(value);
    }

    public CustomerType findByContentOrCode(String content, String code) {
        return customerTypeRepo.findByContentOrCode(content,code);
    }

    public void save(CustomerType providerType) {
        customerTypeRepo.save(providerType);
    }

    public void deleteByCode(String code) {
        List<Customer> list=customerService.findByType(code);
        List<String> codeList=new ArrayList<>();
        for(Customer i:list){
            codeList.add(i.getCode());
        }
        customerService.deleteAllByCode(codeList);
        customerTypeRepo.deleteByCode(code);
    }
}
