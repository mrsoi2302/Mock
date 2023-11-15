package com.example.demo.Service;

import com.example.demo.Entities.Provider;
import com.example.demo.Repositories.ProviderRepo;
import com.example.demo.Repositories.ReceiptRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class ProviderService {
    private ProviderRepo providerRepo;
    private ReceiptRepo receiptRepo;
    public List<Provider> list(String value, String manager, Date createdDate,String type, String status) {
        System.out.println(type);
        return providerRepo.list(value,manager,createdDate,type,status);
    }
    public void save(Provider provider) {
        providerRepo.save(provider);
    }
    public void saveAll(List<Provider> list) {
        providerRepo.saveAll(list);
    }

    public Provider findByCode(String code) {
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
            receiptRepo.deleteAllByProviderCode(p);
        }
        providerRepo.deleteAllByCode(list);
    }

    public List<Provider> findByProviderType(String code) {
        return providerRepo.findAllByProviderType(code);
    }

    public Long countList(String value, String manager, Date createdDate,String type, String status) {
        return providerRepo.countList(value,manager,createdDate,type,status);
    }
    public List<Provider> findForReceipt(String manager){
        return providerRepo.findForReceipt(manager);
    }

    public Provider findByCodeAndManager(String code, String manager) {
        return providerRepo.findByCodeAndManager(code,manager);
    }
}
