package com.example.demo.Repositories;

import com.example.demo.Entities.Provider;
import com.example.demo.Entities.Status;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepo extends JpaRepository<Provider,Long> {
    @Query("select  p from Provider p where " +
            "(:value is null " +
            "or " +
            "p.code like concat('%',:value,'%') " +
            "or " +
            "p.name like concat('%',:value,'%') " +
            "or " +
            "p.contact like concat('%',:value,'%'))" +
            "and " +
            "(:created is null or cast(p.created_date1 as date) =:created)" +
            "and" +
            "(:status is null or p.status=:status) " +
            "order by p.created_date desc   ")
    List<Provider> listAll(@Param("value") String value,
                           @Param("created") Date created,
                           @Param("status") Status status,
                           Pageable pageable);
    Provider findById(long id);
    Provider findByCode(String code);
    void deleteByCode(String code);

}
