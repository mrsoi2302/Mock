package com.example.demo.Service;

import com.example.demo.Entities.Receipt;
import com.example.demo.Repositories.ReceiptRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ReceiptService {
    ReceiptRepo receiptRepo;
    public List<Receipt> listAll(String value, Pageable pageable) {
        return receiptRepo.listAll(value,pageable);
    }

    public Receipt findByCode(String value) {
        return receiptRepo.findByCode(value);
    }

    public void save(Receipt receipt) {
        receiptRepo.save(receipt);
    }

    public void deleteByCode(String code) {
        receiptRepo.deleteByCode(code);
    }
}
