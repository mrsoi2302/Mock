package com.example.demo.Service;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Payment;
import com.example.demo.Repositories.PaymentRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class PaymentService {
    PaymentRepo paymentRepo;
    public List<Payment> listAll(String value, Pageable pageable) {
        return paymentRepo.listAll(value,pageable);
    }

    public Payment findByCode(String value) {
        return paymentRepo.findByCode(value);
    }

    public void save(Payment payment) {
        paymentRepo.save(payment);
    }

    public void deleteByCode(String code) {
        paymentRepo.deleteByCode(code);
    }

    public long count() {
        return paymentRepo.count();
    }

    public long countfilter(String value) {
        return paymentRepo.countFilter(value);
    }

    public void deleteByCustomer(Customer customer) {
        paymentRepo.deleteByCustomer(customer);
    }
}
