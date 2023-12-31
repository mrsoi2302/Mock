package com.example.demo.Service;

import com.example.demo.Entities.Provider;
import com.example.demo.Entities.ProviderType;
import com.example.demo.Entities.Receipt;
import com.example.demo.Repositories.ProviderRepo;
import com.example.demo.Repositories.ProviderTypeRepo;
import com.example.demo.Repositories.ReceiptRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class ProviderService {
    private ProviderRepo providerRepo;
    private ReceiptRepo receiptRepo;
    private ProviderTypeRepo providerTypeRepo;
    public List<Provider> list(String value, String manager, Date createdDate, String type, String status, Pageable pageable) {
        ProviderType p=providerTypeRepo.findByContent(type);
        List<Provider> t=providerRepo.list(value,manager,createdDate,p,status,pageable);
        for(Provider i:t){
            long sum=0;
            for(Receipt j:i.getReceipts()){
                sum+=j.getRevenue();
            }
            i.setTotal(sum);
            providerRepo.save(i);
        }
        return providerRepo.list(value,manager,createdDate,p,status,pageable);
    }
    public void save(Provider provider) {
        providerRepo.save(provider);
    }
    public void saveAll(List<Provider> list) {
        providerRepo.saveAll(list);
    }

    public Provider findByCode(String code) {
        Provider i=providerRepo.findByCode(code);
        long sum=0;
        if(i!=null){
            for (Receipt j : i.getReceipts()) {
                sum += j.getRevenue();
            }
            i.setTotal(sum);
            providerRepo.save(i);
        }
        return providerRepo.findByCode(code);
    }

    public void update(Provider provider) {
        Provider t=providerRepo.findByCode(provider.getCode());
        t.setProvider(provider);
        providerRepo.save(t);
    }

    public void deleteAllByCode(List<String> list) {
        for(String i:list){
            Provider p=providerRepo.findByCode(i);
            List<Receipt> receipts=receiptRepo.findByProvider(p);
            for(Receipt j:receipts){
                j.setProvider(null);
                receiptRepo.save(j);
            }
            providerRepo.delete(p);
        }
    }

    public List<Provider> findByProviderType(ProviderType code) {
        return providerRepo.findAllByProviderType(code);
    }

    public Long countList(String value, String manager, Date createdDate,String type, String status) {
        ProviderType p=providerTypeRepo.findByContent(type);

        return providerRepo.countList(value,manager,createdDate,p,status);
    }
    public List<Provider> findForReceipt(String manager){
        return providerRepo.findForReceipt(manager);
    }

    public Provider findByCodeAndManager(String code, String manager) {
        Provider i=providerRepo.findByCodeAndManager(code,manager);
        long sum=0;
        for(Receipt j:i.getReceipts()){
            sum+=j.getRevenue();
        }
        i.setTotal(sum);
        providerRepo.save(i);
        return providerRepo.findByCodeAndManager(code,manager);
    }
}
