package com.example.demo.Service;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.Provider;
import com.example.demo.Repositories.ProviderRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ProviderService {
    private ProviderRepo providerRepo;
    public List<Provider> listAll(Value<Provider> value, Pageable pageable) {
        return providerRepo.listAll(value.getValue(), value.getT().getCreated_date(), value.getT().getStatus(), pageable);
    }

    public Provider findByCode(String value) {
        return providerRepo.findByCode(value);
    }

    public void save(Provider provider) {
        providerRepo.save(provider);
    }

    public void deleteByCode(String code) {
        providerRepo.deleteByCode(code);
    }

    public long count() {
        return providerRepo.count();
    }
}
