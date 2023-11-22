package com.example.demo.Repositories;

import com.example.demo.Entities.PaymentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentGroupRepository extends JpaRepository<PaymentGroup,Long> {
    @Query("select p from PaymentGroup p where :value is null or p.name like concat('%',:value,'%') or p.code like concat('%',:value,'%') order by p.id desc")
    List<PaymentGroup> list(String value);

    PaymentGroup findByCode(String code);
}
