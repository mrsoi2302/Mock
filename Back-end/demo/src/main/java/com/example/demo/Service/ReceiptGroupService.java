package com.example.demo.Service;

import com.example.demo.Entities.ReceiptGroup;
import com.example.demo.Repositories.ReceiptGroupRepository;
import com.example.demo.Repositories.ReceiptRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReceiptGroupService {
    private final ReceiptGroupRepository receiptGroupRepository;
    private final ReceiptRepo receiptRepo;

    public ReceiptGroupService(ReceiptGroupRepository receiptGroupRepository, ReceiptRepo receiptRepo) {
        this.receiptGroupRepository = receiptGroupRepository;
        this.receiptRepo = receiptRepo;
    }

    public List<ReceiptGroup> list(String value) {
        return receiptGroupRepository.list(value);
    }

    public ReceiptGroup findByCode(String code) {
        return receiptGroupRepository.findByCode(code);
    }

    public void save(ReceiptGroup receiptGroup) {
        receiptGroupRepository.save(receiptGroup);
    }

    public void deleteByListCode(List<String> listCode) {
        for(String i:listCode){
            ReceiptGroup receiptGroup=receiptGroupRepository.findByCode(i);
            receiptRepo.deleteByReceiptGroup(receiptGroup);
            receiptGroupRepository.delete(receiptGroup);
        }
    }
}
