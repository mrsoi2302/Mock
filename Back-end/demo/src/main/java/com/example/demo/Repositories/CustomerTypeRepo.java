package com.example.demo.Repositories;

import com.example.demo.Entities.CustomerType;
import com.example.demo.Entities.ProviderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerTypeRepo extends JpaRepository<CustomerType,Long> {
    @Query("select c from CustomerType c where :value is null or c.code=:value or c.content=:value order by c.id desc ")
    List<CustomerType> list(String value);

    CustomerType findByContentOrCode(String content, String code);

    void deleteByCode(String code);

    CustomerType findByContent(String content);

    CustomerType findByCode(String code);
}
