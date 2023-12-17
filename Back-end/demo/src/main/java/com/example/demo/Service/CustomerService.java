package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.CustomerType;
import com.example.demo.Entities.Payment;
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
    public List<Customer> list(String value, String manager, int birthdayDay, int birthdayMonth, int birthdayYear, String status, String gender, CustomerType customerType, Pageable pageable) {
        List<Customer> customers=customerRepo.list(value,manager,birthdayDay,birthdayMonth,birthdayYear,status,gender,customerType,pageable);
        for(Customer i:customers){
            List<Payment> payments=paymentRepo.findByCustomer(i);
            if(!payments.isEmpty())i.setTotal((long)paymentRepo.countBill(i));
            customerRepo.save(i);
        }
        return customerRepo.list(value,manager,birthdayDay,birthdayMonth,birthdayYear,status,gender,customerType,pageable);
    }
    public Long countList(String value, String manager, int birthdayDay, int birthdayMonth, int birthdayYear, String status, String gender,CustomerType customerType) {
        return customerRepo.countList(value,manager,birthdayDay,birthdayMonth,birthdayYear,status,customerType,gender);
    }

    public Customer findByCode(String code) {
        Customer i=customerRepo.findByCode(code);
        List<Payment> payments=paymentRepo.findByCustomer(i);
        if(!payments.isEmpty()) {
            i.setTotal((long)paymentRepo.countBill(i));
            customerRepo.save(i);
        }
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
        customerRepo.save(t);
    }

    public void deleteAllByCode(List<String> list) {
        for(String i:list){
            Customer customer=customerRepo.findByCode(i);
            List<Payment> payments=paymentRepo.findByCustomer(customer);
            for(Payment j:payments){
                j.setCustomer(null);
                paymentRepo.save(j);
            }
            customerRepo.delete(customer);
        }
    }
    public List<Customer> findForPayment(String manager){
        return customerRepo.findForPayment(manager);
    }

    public Customer findByCodeAndManager(String code, String manager) {
        return customerRepo.findByCodeAndManager(code,manager);
    }
}
