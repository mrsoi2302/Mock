package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Payment;
import com.example.demo.Entities.PaymentGroup;
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
    public List<Payment> list(String value, String manager, Date createdDate, PaymentType paymentType, String status, PaymentGroup paymentGroup, Pageable pageable) {
        return paymentRepo.list(value,manager,createdDate,paymentType,status,paymentGroup,pageable);
    }

    public Payment findByCode(String code) {
        Payment payment=paymentRepo.findByCode(code);
        return payment;
    }

    public void update(Payment payment) {
            Payment p=paymentRepo.findByCode(payment.getCode());
        if(payment.getCustomer()!=null) {
            Customer customer = customerRepo.findByCode(payment.getCustomer().getCode());
            p.setCustomer_name(customer.getName() + " " + customer.getCode());
        }
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

    public Long countAll(Date date) {
        return paymentRepo.countAll(date);
    }

    public Long countToday(Date date) {
        return paymentRepo.countDate(date);
    }

    public Long countList(String value, String manager, Date createdDate, PaymentType paymentType, String status,PaymentGroup paymentGroup) {
        return paymentRepo.countList(value,manager,createdDate,paymentType,status,paymentGroup);
    }

    public Payment findByCodeAndManager(String code, String manager) {
        return paymentRepo.findByCodeAndManager(code,manager);
    }
    public List<Payment> findByCustomer(Customer customer){
        return paymentRepo.findByCustomer(customer);
    }
}
