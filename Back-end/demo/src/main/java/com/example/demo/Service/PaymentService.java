package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Payment;
import com.example.demo.Entities.PaymentType;
import com.example.demo.Repositories.CustomerRepo;
import com.example.demo.Repositories.PaymentRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class PaymentService {
    private final PaymentRepo paymentRepo;
    private final CustomerRepo customerRepo;

    public List<Payment> findAll(String manager){
        return paymentRepo.findAllByMananger(manager);
    }
    public void deleteByCustomerCode(List<String> list) {
        paymentRepo.deleteByCustomerCode(list);
    }

    public List<Payment> list(String value, String manager, Date createdDate, PaymentType paymentType, String status, Pageable pageable) {
        List<Payment> list=paymentRepo.list(value,createdDate,paymentType,status,pageable);
        for(Payment i:list){
            Customer customer=customerRepo.findByCode(i.getCustomer().getCode());
            customer.setTotal(countBill(customer));
        }
        return list;
    }

    public Payment findByCode(String code) {
        Payment payment=paymentRepo.findByCode(code);
        Customer customer=customerRepo.findByCode(payment.getCustomer().getCode());
        customer.setTotal(countBill(customer));
        return payment;
    }

    public void update(Payment payment) {
        Payment p=findByCode(payment.getCode());
        p.setPayment(payment);
    }

    public void deleteAllByCode(List<String> list) {
        paymentRepo.deleteAllByCode(list);
    }

    public void save(Payment payment) {
        paymentRepo.save(payment);
        Customer customer=customerRepo.findByCode(payment.getCustomer().getCode());
        customer.setTotal(countBill(customer));
    }
    private Long countBill(Customer customer) {
        return paymentRepo.countBill(customer);
    }

    public List<Payment> findByType(String name) {
        return paymentRepo.findByType(name);
    }

    public Long countAll() {
        return paymentRepo.countAll();
    }

    public Long countToday(Date date) {
        return paymentRepo.countDate(date);
    }

    public Long countList(String value, String manager, Date createdDate, PaymentType paymentType, String status) {
        return paymentRepo.countList(value,createdDate,paymentType,status);
    }

    public Payment findByCodeAndManager(String code, String manager) {
        return paymentRepo.findByCodeAndManager(code,manager);
    }
}
