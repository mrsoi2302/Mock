package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.CustomerType;
import com.example.demo.Repositories.CustomerRepo;
import com.example.demo.Repositories.CustomerTypeRepo;
import com.example.demo.Repositories.PaymentRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CustomerTypeService {
    private final CustomerTypeRepo customerTypeRepo;
    private final CustomerRepo customerRepo;
    private final PaymentRepo paymentRepo;
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
        customerTypeRepo.deleteByCode(code);
    }

    public CustomerType findByContent(String content) {
        return  customerTypeRepo.findByContent(content);
    }
}
