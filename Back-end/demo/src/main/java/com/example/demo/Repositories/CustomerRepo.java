package com.example.demo.Repositories;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.CustomerType;
import com.example.demo.Entities.Status;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CustomerRepo extends JpaRepository<Customer,Long> {
    @Query("select c from Customer c where " +
            "(:value is null or (c.code like concat('%',:value,'%') or c.name like concat('%',:value,'%') or c.contact like concat('%',:value,'%'))) " +
            "and " +
            "(:day=0 or c.birthday_day=:day) " +
            "and    " +
            "(:month =0 or c.birthday_month=:month) " +
            "and " +
            "(:year=0 or c.birthday_year=:year) " +
            "and " +
            "(:gender IS null or c.gender=:gender) " +
            "and " +
            "(:created is null or cast(c.created_date as date) =:created)  " +
            "and " +
            "(:status is null or c.status=:status)" +
            "and" +
            " (:type is null or c.customerType=:type)" +
            "order by c.created_date desc ")
    List<Customer> findAll(@Param("value") String value,
                           @Param("created")Date createdDate,
                           @Param("status") Status status,
                           @Param("day") int day,
                           @Param("month") int month,
                           @Param("year") int year,
                           @Param("gender") String gender,
                           @Param("type")CustomerType customerType,
                           Pageable pageable);
    @Query("select count(c) from Customer c where " +
            "(:value is null or (c.code like concat('%',:value,'%') or c.name like concat('%',:value,'%') or c.contact like concat('%',:value,'%'))) " +
            "and " +
            "(:day IS null or c.birthday_day=:day) " +
            "and " +
            "(:month IS null or c.birthday_month=:month) " +
            "and " +
            "(:year IS null or c.birthday_year=:year) " +
            "and " +
            "(:gender IS null or c.gender=:gender) " +
            "and " +
            "(:created is null or cast(c.created_date1 as date) =:created)  " +
            "and " +
            "(:status is null or c.status=:status)" +
            "and" +
            " (:type is null or c.customerType=:type)" +
            "order by c.created_date desc ")
    long countAll(@Param("value") String value,
                  @Param("created")Date createdDate,
                  @Param("status") Status status,
                  @Param("day") int day,
                  @Param("month") int month,
                  @Param("year") int year,
                  @Param("gender") String gender,
                  @Param("type") CustomerType customerType);
    Customer findByCode(String code);

    void deleteByCode(String code);
    Customer findById(long id);
}
