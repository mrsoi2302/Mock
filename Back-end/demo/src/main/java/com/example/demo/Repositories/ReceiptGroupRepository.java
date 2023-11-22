package com.example.demo.Repositories;

import com.example.demo.Entities.PaymentGroup;
import com.example.demo.Entities.ReceiptGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptGroupRepository extends JpaRepository<ReceiptGroup,Long> {
    @Query("select r from ReceiptGroup r where :value is null or r.code like concat('%',:value,'%') or r.name like concat('%',:value,'%') order by r.id desc ")
    List<ReceiptGroup> list(String value);

    ReceiptGroup findByCode(String code);
}
