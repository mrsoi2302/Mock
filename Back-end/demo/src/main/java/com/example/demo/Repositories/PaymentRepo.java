package com.example.demo.Repositories;

import com.example.demo.Entities.Customer;
import com.example.demo.Entities.Payment;
import com.example.demo.Entities.PaymentGroup;
import com.example.demo.Entities.PaymentType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<Payment,Long> {
    @Modifying
    @Query("delete from Payment p where p.customer=:customer")
    void deleteByCustomerCode(Customer customer);
    @Query("select p from Payment p where " +
            "(:value is null or p.code like concat('%',:value,'%')) " +
            "and" +
            "(:manager is null or p.manager=:manager)" +
            "and" +
            "(:date is null or cast(p.created_date1 as date)=:date)" +
            "and" +
            "(:type is null or p.paymentType=:type)" +
            "and " +
            "(:status is null or p.status=:status)" +
            "and" +
            "(:group is null or p.paymentGroup=:group)")
    List<Payment> list(@Param("value") String value,
                       @Param("manager") String manager,
                       @Param("date") Date createdDate,
                       @Param("type") PaymentType paymentType,
                       @Param(("status")) String status,
                       @Param("group") PaymentGroup paymentGroup,
                       Pageable pageable);

    Payment findByCode(String code);
    @Modifying
    @Query("DELETE from Payment p where p.code in :list")
    void deleteAllByCode(List<String> list);
    @Query("select p from Payment p where p.paymentType.name=:name")
    List<Payment> findByType(String name);
    @Query("select sum(p.paid) from Payment p where p.customer=:customer")
    Long countBill(Customer customer);
    @Query("select sum(p.paid) from Payment p where :date is null or cast(p.created_date1 as date)=:date ")
    Long countAll(Date date);
    @Query("select sum(p.paid) from Payment p where cast(p.created_date1 as date)=:date")
    Long countDate(Date date);
    @Query("select count(p) from Payment p where " +
            "(:value is null or p.code like concat('%',:value,'%')) " +
            "and" +
            "(:date is null or cast(p.created_date1 as date)=:date)" +
            "and " +
            "((:manager is null or :status='dung') or p.manager=:manager)" +
            "and" +
            "(:type is null or p.paymentType=:type)" +
            "and " +
            "(:status is null or :status='dung' or p.status=:status)" +
            "and" +
            "(:group is null or p.paymentGroup=:group)")
    Long countList(@Param("value") String value,
                   @Param("manager") String manager,
                   @Param("date") Date createdDate,
                   @Param("type") PaymentType paymentType,
                   @Param("status") String status,
                   @Param("group") PaymentGroup paymentGroup);
    @Query("select p from Payment p where :manager is null or p.manager=:manager")
    List<Payment> findAllByMananger(String manager);
    @Query("select p from Payment p where(:manager is null or p.manager=:manager) and p.code=:code")
    Payment findByCodeAndManager(@Param("code") String code, @Param("manager") String manager);
    @Query("select p from Payment p where p.customer=:i")
    List<Payment> findByCustomer(Customer i);
    @Modifying
    @Query("delete from Payment p where p.customer in :list")
    void deleteByCustomerList(List<Customer> list);
    @Modifying
    @Query("delete from Payment p where p.paymentGroup=:p")
    void deleteByPaymentGroup(PaymentGroup p);

    List<Payment> findByPaymentGroup(PaymentGroup p);

}
