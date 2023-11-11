package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Repositories.CustomerRepo;
import com.example.demo.Repositories.PaymentRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerService {
    private CustomerRepo customerRepo;
    private PaymentRepo paymentRepo;
    public List<Customer> list(String value,String manager, int birthdayDay, int birthdayMonth, int birthdayYear, String status, String gender, Pageable pageable) {
        return customerRepo.list(value,manager,birthdayDay,birthdayMonth,birthdayYear,status,gender,pageable);
    }
    public Long countList(String value, String manager, int birthdayDay, int birthdayMonth, int birthdayYear, String status, String gender) {
        return customerRepo.countList(value,manager,birthdayDay,birthdayMonth,birthdayYear,status,gender);
    }

    public Customer findByCode(String code) {
        return customerRepo.findByCode(code);
    }

    public void save(Customer customer) {
        customerRepo.save(customer);
    }

    public void saveAll(List<Customer> list) {
        customerRepo.saveAll(list);
    }

    public void update(Customer customer) {
        Customer t=findByCode(customer.getCode());
        t.setCustomer(customer);
    }

    public void deleteAllByCode(List<String> list) {
        paymentRepo.deleteByCustomerCode(list);
        customerRepo.deleteAllByCode(list);

    }
    public List<Customer> findByType(String code) {
        return customerRepo.findByType(code);
    }
    public List<Customer> findForPayment(String manager){
        return customerRepo.findForPayment(manager);
    }

    public List<Customer> findByCodeAndManager(String code, String manager) {
        return customerRepo.findByCodeAndManager(code,manager);
    }
}
