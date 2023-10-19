package com.example.demo.Repositories;

import com.example.demo.Entities.CustomerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerTypeRepo extends JpaRepository<CustomerType,Long> {
    @Query("SELECT c from CustomerType c order by c.created_date desc ")
    List<CustomerType> findAll(int s,Pageable pageable);

    CustomerType findByName(String name);
    CustomerType findById(long id);

    void deleteByName(String name);
}
