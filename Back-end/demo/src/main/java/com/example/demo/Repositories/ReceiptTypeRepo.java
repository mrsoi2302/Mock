package com.example.demo.Repositories;

import com.example.demo.Entities.ReceiptType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptTypeRepo extends JpaRepository<ReceiptType,Long> {
    ReceiptType findByName(String name);
}
