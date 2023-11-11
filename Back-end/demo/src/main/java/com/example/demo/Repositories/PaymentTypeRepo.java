package com.example.demo.Repositories;

import com.example.demo.Entities.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTypeRepo extends JpaRepository<PaymentType,Long> {
    @Query("select p from PaymentType p where p.name like concat('%',:value,'%') ")
    List<PaymentType> list(String value);

    PaymentType findByName(String name);

    void deleteByName(String name);
}
