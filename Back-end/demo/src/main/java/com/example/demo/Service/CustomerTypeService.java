package com.example.demo.Service;

import com.example.demo.Entities.CustomerType;
import com.example.demo.Repositories.CustomerTypeRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CustomerTypeService {
    CustomerTypeRepo customerTypeRepo;
    public void save(CustomerType customerType) {
        customerTypeRepo.save(customerType);
    }

    public List<CustomerType> findAll(Pageable p) {
        return customerTypeRepo.findAll(1,p);
    }

    public CustomerType findByName(String name) {
        return customerTypeRepo.findByName(name);
    }

    public void deleteById(Long id) {
        customerTypeRepo.deleteById(id);
    }

    public void deleteByName(String name) {
        customerTypeRepo.deleteByName(name);
    }

    public long count() {
        return customerTypeRepo.count();
    }

    public List<CustomerType> findAll() {
        return customerTypeRepo.findAll();
    }

    public CustomerType findById(long id) {
        return customerTypeRepo.findById(id);
    }
}
