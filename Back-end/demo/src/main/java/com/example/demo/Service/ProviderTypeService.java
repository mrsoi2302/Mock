package com.example.demo.Service;

import com.example.demo.Entities.Provider;
import com.example.demo.Entities.ProviderType;
import com.example.demo.Repositories.ProviderTypeRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class ProviderTypeService {
    private ProviderTypeRepo providerTypeRepo;
    private ProviderService providerService;
    public List<ProviderType> list(String value) {
        return providerTypeRepo.list(value);
    }

    public ProviderType findByContentOrCode(String content, String code) {
        return providerTypeRepo.findByContentOrCode(content,code);
    }

    public void save(ProviderType providerType) {
        providerTypeRepo.save(providerType);
    }

    public void deleteByCode(String code) {
        List<Provider> list= providerService.findByProviderType(code);
        for(Provider i:list){
            providerService.deleteAllByCode(Collections.singletonList(i.getCode()));
        }
        providerTypeRepo.deleteByCode(code);
    }

    public ProviderType findByContent(String content) {
        return providerTypeRepo.findByContent(content);
    }
}
