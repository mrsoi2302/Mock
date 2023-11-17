package com.example.demo.Repositories;

import com.example.demo.Entities.Provider;
import com.example.demo.Entities.ProviderType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProviderRepo extends JpaRepository<Provider,Long> {
    @Query("SELECT p from Provider p where " +
            "(:value is null or " +
            "(p.code like concat('%',:value,'%'))" +
            "or" +
            "(p.name like concat('%',:value,'%'))" +
            "or " +
            "p.contact like concat('%',:value,'%')" +
            "or " +
            "p.email like concat('%',:value,'%'))" +
            "and" +
            "(:createdDate is null or cast(p.created_date1 as date )=:createdDate )" +
            "and" +
            "(:status is null or p.status=:status)" +
            "and" +
            "(:manager is null or p.manager=:manager)" +
            "and" +
            "(:type is null or p.provider_type.content=:type)")
    List<Provider> list(@Param("value")String value,
                        @Param("manager") String manager,
                        @Param("createdDate")Date createdDate,
                        @Param("type") String type,
                        @Param("status")String status,
                        Pageable pageable);
    @Query("SELECT count(p) from Provider p where " +
            "(:value is null or " +
            "(p.code like concat('%',:value,'%'))" +
            "or" +
            "(p.name like concat('%',:value,'%'))" +
            "or " +
            "p.contact like concat('%',:value,'%')" +
            "or " +
            "p.email like concat('%',:value,'%'))" +
            "and" +
            "(:date is null or cast(p.created_date1 as date )=:date )" +
            "and" +
            "(:status is null or p.status=:status)" +
            "and" +
            "(:manager is null or p.manager=:manager)" +
            "and" +
            "(:type is null or p.provider_type.content=:type)")
    Long countList(@Param("value")String value,
                        @Param("manager") String manager,
                        @Param("date")Date createdDate,
                        @Param("type") String type,
                        @Param("status")String status);
    @Query("select p from Provider p where p.code=:code")
    Provider findByCode(String code);
    @Modifying
    @Query("delete from Provider p where p.code in :list")
    void deleteAllByCode(List<String> list);
    @Query("select p from Provider p where p.provider_type.code=:code")
    List<Provider> findAllByProviderType(String code);
    @Query("select p from Provider p where (:manager is null or p.manager=:manager) and p.status='active' and p.provider_type=:providerType")
    List<Provider> findForReceipt(@Param("manager") String manager, @Param("providerType") ProviderType providerType);
    @Query("select p from Provider p where (:manager is null or p.manager=:manager) and p.code=:code")
    Provider findByCodeAndManager(@Param("code") String code,@Param("manager") String manager);
}
