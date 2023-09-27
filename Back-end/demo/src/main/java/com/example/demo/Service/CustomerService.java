package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Repositories.CustomerRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.lang.reflect.GenericDeclaration;
import java.lang.reflect.TypeVariable;
import java.util.List;

@AllArgsConstructor
@Service
public class CustomerService {
    CustomerRepo customerRepo;
    public List<Customer> findAll(String value,
                           int day,
                           int month,
                           int year,
                           String gender,
                           Pageable pageable){
        return customerRepo.findAll(value,day,month,year,gender,pageable);
    }

    public Customer findByCode(String code) {
        return customerRepo.findByCode(code);
    }

    public void save(Customer customer) {
        customerRepo.save(customer);
    }

    public void deleteById(Long id) {
        customerRepo.deleteById(id);
    }

    public void deleteByCode(String code) {
        customerRepo.deleteByCode(code);
    }
}
