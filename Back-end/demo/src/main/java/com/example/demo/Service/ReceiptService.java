package com.example.demo.Service;

import com.example.demo.Entities.*;
import com.example.demo.Entities.Receipt;
import com.example.demo.Repositories.ProviderRepo;
import com.example.demo.Repositories.ReceiptRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class ReceiptService {
    private ReceiptRepo receiptRepo;
    private ProviderRepo providerRepo;
    public void deleteByProviderCode(Provider i) {
        receiptRepo.deleteAllByProviderCode(i);
    }
    public List<Receipt> findAll(String manager){
        return receiptRepo.findAllByMananger(manager);
    }
    public List<Receipt> list(String value, String manager, Date createdDate, PaymentType paymentType, String status, Pageable pageable) {
        List<Receipt> list =receiptRepo.list(value,createdDate,paymentType,status,pageable);
        for(Receipt i:list){
            Provider provider=providerRepo.findByCode(i.getProvider().getCode());
            provider.setTotal(countBill(provider));

        }
        return list;
    }
    public Long countList(String value, String manager, Date createdDate, PaymentType paymentType, String status){
        return receiptRepo.countList(value,createdDate,paymentType,status);
    }

    public Receipt findByCode(String code) {
        Receipt receipt=receiptRepo.findByCode(code);
        Provider provider=providerRepo.findByCode(receipt.getProvider().getCode());
        provider.setTotal(countBill(provider));
        return receipt;
    }

    public void save(Receipt receipt) {
        receiptRepo.save(receipt);
    }

    public void update(Receipt receipt) {
        Receipt p=findByCode(receipt.getCode());
        p.setReceipt(receipt);
    }

    private Long countBill(Provider provider) {
        return receiptRepo.countBill(provider);
    }

    public void deleteAllByCode(List<String> list) {
        receiptRepo.deleteAllByCode(list);
    }

    public List<Receipt> findByType(String name) {
        return receiptRepo.findByType(name);
    }

    public Long countAll() {
        return receiptRepo.countAll();
    }

    public Long countToday(Date date) {
        return receiptRepo.countDate(date);
    }

    public Receipt findByCodeAndManager(String code, String manager) {
        return receiptRepo.findByCodeAndManager(code,manager);
    }
}
