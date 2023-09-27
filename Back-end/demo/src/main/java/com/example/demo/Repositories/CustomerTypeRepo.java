package com.example.demo.Repositories;

import com.example.demo.Entities.CustomerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerTypeRepo extends JpaRepository<CustomerType,Long> {
    @Query("SELECT c from CustomerType c")
    Page<CustomerType> findAll(Pageable pageable);

    CustomerType findByName(String name);

    void deleteByName(String name);
}
