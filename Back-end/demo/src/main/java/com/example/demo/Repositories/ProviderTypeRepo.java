package com.example.demo.Repositories;

import com.example.demo.Entities.ProviderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderTypeRepo extends JpaRepository<ProviderType,Long> {
    @Query("SELECT p from ProviderType p where :value is null or p.content like concat('%',:value,'%')")
    List<ProviderType> list(String value);

    ProviderType findByContentOrCode(String content, String code);
    @Modifying
    @Query("DELETE from ProviderType p where p.code=:code")
    void deleteByCode(String code);

    ProviderType findByContent(String content);
}
