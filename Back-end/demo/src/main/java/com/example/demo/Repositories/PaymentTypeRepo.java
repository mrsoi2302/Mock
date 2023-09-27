package com.example.demo.Repositories;

import com.example.demo.Entities.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTypeRepo extends JpaRepository<PaymentType,Long> {
    PaymentType findByName(String name);

    void deleteByName(String value);
}
