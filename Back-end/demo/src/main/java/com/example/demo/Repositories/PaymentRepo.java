package com.example.demo.Repositories;

import com.example.demo.Entities.Payment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<Payment,Long> {
    @Query("select p from Payment p where " +
            ":value is null " +
            "or " +
            "p.code like concat('%',:value,'%')")
    List<Payment> listAll(@Param("value") String value, Pageable pageable);

    Payment findByCode(String code);

    void deleteByCode(String code);
}
