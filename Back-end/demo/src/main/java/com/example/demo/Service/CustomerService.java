package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.CustomerType;
import com.example.demo.Entities.Status;
import com.example.demo.Repositories.CustomerRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@Service
public class CustomerService {
    CustomerRepo customerRepo;
    public List<Customer> findAll(String value,
                                  Status status, Date createdDate, int day,
                                  int month,
                                  int year,
                                  String gender,
                                  Pageable pageable, CustomerType customerType){
        return customerRepo.findAll(value,createdDate,status,day,month,year,gender,customerType,pageable);
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

    public Customer findById(long id) {
        return customerRepo.findById(id);
    }

    public long count() {
        return customerRepo.count();
    }

    public long countAll(String value, Status status, Date createdDate, int day, int month, int year, String gender, CustomerType customerType) {
        return customerRepo.countAll(value,createdDate,status,day,month,year,gender,customerType);
    }

    public List<Customer> findAll() {
        return customerRepo.findAll();
    }
}
