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
    public List<Payment> list(String value, String manager, Date createdDate, PaymentType paymentType, String status, Pageable pageable) {
        return paymentRepo.list(value,manager,createdDate,paymentType,status,pageable);
    }

    public Payment findByCode(String code) {
        Payment payment=paymentRepo.findByCode(code);
        return payment;
    }

    public void update(Payment payment) {
        Payment p=findByCode(payment.getCode());
        p.setPayment(payment);
        paymentRepo.save(p);
    }

    public void deleteAllByCode(List<String> list) {
        paymentRepo.deleteAllByCode(list);
    }

    public void save(Payment payment) {
        paymentRepo.save(payment);
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
        return paymentRepo.countList(value,manager,createdDate,paymentType,status);
    }

    public Payment findByCodeAndManager(String code, String manager) {
        return paymentRepo.findByCodeAndManager(code,manager);
    }
    public List<Payment> findByCustomer(Customer customer){
        return paymentRepo.findByCustomer(customer);
    }
}
