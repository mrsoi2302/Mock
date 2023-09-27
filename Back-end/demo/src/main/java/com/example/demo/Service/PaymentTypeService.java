package com.example.demo.Service;

import com.example.demo.Entities.PaymentType;
import com.example.demo.Repositories.PaymentTypeRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class PaymentTypeService {
    PaymentTypeRepo paymentTypeRepo;
    public List<PaymentType> findAll() {
        return paymentTypeRepo.findAll();
    }

    public PaymentType findByName(String name) {
        return paymentTypeRepo.findByName(name);
    }

    public void save(PaymentType paymentType) {
        paymentTypeRepo.save(paymentType);
    }

    public void deleteByName(String value) {
        paymentTypeRepo.deleteByName(value);
    }
}
