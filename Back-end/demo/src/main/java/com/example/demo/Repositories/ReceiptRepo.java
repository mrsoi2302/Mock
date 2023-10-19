package com.example.demo.Repositories;

import com.example.demo.Entities.Provider;
import com.example.demo.Entities.Receipt;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptRepo extends JpaRepository<Receipt,Long> {
    @Query("select r from Receipt r where " +
            ":value is null " +
            "or " +
            "r.code like concat('%',:value,'%') ")
    List<Receipt> listAll(String value, Pageable pageable);
    Receipt findByCode(String value);

    void deleteByCode(String code);
    @Query("SELECT count(r) from Receipt r where " +
            ":value is null or r.code like concat('%',:value,'%') ")
    long countFilter(String value);
    void deleteByProvider(Provider provider);
}
