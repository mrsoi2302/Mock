package com.example.demo.Repositories;

import com.example.demo.Entities.Customer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepo extends JpaRepository<Customer,Long> {
    @Query("select c from Customer c where " +
            "(:value is null or (c.code like concat('%',:value,'%') or c.name like concat('%',:value,'%') or c.contact like concat('%',:value,'%')))" +
            "and " +
            "(:day IS null or c.birthday_day=:day)" +
            "and" +
            "(:month IS null or c.birthday_month=:month)" +
            "and" +
            "(:year IS null or c.birthday_year=:year)" +
            "and" +
            "(:gender IS null or c.gender=:month)")
    List<Customer> findAll(@Param("value") String value,
                                 @Param("day") int day,
                                 @Param("month") int month,
                                 @Param("year") int year,
                                 @Param("gender") String gender,
                                 Pageable pageable);

    Customer findByCode(String code);

    void deleteByCode(String code);
}
