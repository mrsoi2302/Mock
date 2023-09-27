package com.example.demo.Service;

import com.example.demo.Entities.ReceiptType;
import com.example.demo.Repositories.ReceiptTypeRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ReceiptTypeService {
    ReceiptTypeRepo receiptTypeRepo;
    public List<ReceiptType> findAll() {
        return receiptTypeRepo.findAll();
    }

    public ReceiptType findByName(String name) {
        return receiptTypeRepo.findByName(name);
    }

    public void save(ReceiptType receiptType) {
        receiptTypeRepo.save(receiptType);
    }

    public void delete(ReceiptType resource) {
        receiptTypeRepo.delete(resource);
    }
}
