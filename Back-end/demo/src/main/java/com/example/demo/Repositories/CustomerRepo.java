package com.example.demo.Repositories;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.CustomerType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepo extends JpaRepository<Customer,Long> {
    @Query("select c from Customer c where " +
            "(:value is null " +
            "or c.code like concat('%',:value,'%') " +
            "or c.name like concat('%',:value,'%') " +
            "or c.contact like concat('%',:value,'%') " +
            "or c.email like concat('%',:value,'%')) " +
            "and " +
            "(:day=0 or day(c.birthday)=:day)" +
            "and" +
            "(:month=0 or month (c.birthday)=:month)" +
            "and" +
            "(:year=0 or year(c.birthday)=:year)" +
            "and" +
            "(:status is null or c.status=:status)" +
            "and" +
            "(:gender is null or c.gender=:gender)" +
            "and" +
            "(:manager is null or c.manager=:manager)" +
            "and" +
            "(:customer_type is null or c.customer_type=:customer_type)")
    List<Customer> list(@Param("value") String value,
                        @Param("manager") String manager,
                        @Param("day") int birthdayDay,
                        @Param("month") int birthdayMonth,
                        @Param("year") int birthdayYear,
                        @Param("status") String status,
                        @Param("gender") String gender,
                        @Param("customer_type") CustomerType customerType,
                        Pageable pageable);

    @Query("select count(c) from Customer c where " +
            "(:value is null " +
            "or c.code like concat('%',:value,'%') " +
            "or c.name like concat('%',:value,'%') " +
            "or c.contact like concat('%',:value,'%') " +
            "or c.email like concat('%',:value,'%'))" +
            "and " +
            "(:day =0 or day(c.birthday)=:day)" +
            "and" +
            "(:month =0 or month(c.birthday)=:month)" +
            "and" +
            "(:year =0 or year(c.birthday)=:year)" +
            "and" +
            "(:status is null or c.status=:status)" +
            "and" +
            "(:gender is null or c.gender=:gender)" +
            "and" +
            "(:manager is null or c.manager=:manager)" +
            "and" +
            "(:customer_type is null or c.customer_type=:customer_type)")
    Long countList(@Param("value") String value,
                   @Param("manager") String manager,
                   @Param("day") int birthdayDay,
                   @Param("month") int birthdayMonth,
                   @Param("year") int birthdayYear,
                   @Param("status") String status,
                   @Param("customer_type") CustomerType customerType,
                   @Param("gender") String gender);
    Customer findByCode(String code);
    @Modifying
    @Query("delete from Customer c where c.code in :list")
    void deleteAllByCode(List<String> list);

    @Query("select c from Customer c where c.customer_type=:code")
    List<Customer> findByType(CustomerType code);
    @Query("select c from Customer c where (:manager is null or c.manager=:manager) and c.status='active'")
    List<Customer> findForPayment(@Param("manager") String manager);
    @Query("select c from Customer c where (:manager is null or c.manager=:manager) and c.code=:code")
    Customer findByCodeAndManager(@Param("code") String code, @Param("manager") String manager);
}
