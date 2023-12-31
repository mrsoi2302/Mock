package com.example.demo.Repositories;

import com.example.demo.Entities.PaymentType;
import com.example.demo.Entities.Provider;
import com.example.demo.Entities.Receipt;
import com.example.demo.Entities.ReceiptGroup;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ReceiptRepo extends JpaRepository<Receipt,Long> {
    @Modifying
    @Query("delete from Receipt r where r.provider=:code")
    void deleteAllByProviderCode(@Param("code") Provider code);
    @Query("select r from Receipt r where " +
            "(:value is null or r.code like concat('%',:value,'%'))" +
            "and" +
            "(:manager is null or r.manager=:manager)" +
            "and"+
            "(:date is null or cast(r.created_date1 as date )=:date )" +
            "and" +
            "(:type is null or r.payment_type=:type)" +
            "and " +
            "(:status is null or r.status=:status)" +
            "and " +
            "(:group is null or r.receiptGroup=:group)")
    List<Receipt> list(@Param("value") String value,
                       @Param("manager")String manager,
                       @Param("date") Date createdDate,
                       @Param("type") PaymentType paymentType,
                       @Param("status") String status,
                       @Param("group") ReceiptGroup group,
                       Pageable pageable);
    @Query("select count(r) from Receipt r where " +
            "(:value is null or r.code like concat('%',:value,'%'))" +
            "and" +
            "((:manager is null or :status='dung') or r.manager=:manager)" +
            "and" +
            "(:date is null or cast(r.created_date1 as date )=:date )" +
            "and" +
            "(:type is null or r.payment_type=:type)" +
            "and " +
            "(:status is null or :status='dung' or r.status=:status) " +
            "and " +
            "(:group is null  or r.receiptGroup=:group)")
    Long countList(@Param("value") String value,
                   @Param("manager") String manager,
                   @Param("date") Date createdDate,
                   @Param("type") PaymentType paymentType,
                   @Param("status") String status,
                   @Param("group") ReceiptGroup receiptGroup);
    Receipt findByCode(String code);
    @Modifying
    @Query("delete from Receipt r where r.code in :list")
    void deleteAllByCode(List<String> list);
    @Query("select r from Receipt r where r.payment_type.name=:name")
    List<Receipt> findByType(String name);
    @Query("select sum(r.revenue) from Receipt r where r.provider=:provider")
    Long countBill(Provider provider);
    @Query("select sum(r.revenue) from Receipt r where :date is null or cast(r.created_date1 as date)=:date")
    Long countAll(Date date);
    @Query("select sum(r.revenue) from Receipt r where cast(r.created_date1 as date)=:date")
    Long countDate(Date date);
    @Query("select r from Receipt r where :manager is null or r.manager=:manager")
    List<Receipt> findAllByMananger(String manager);
    @Query("select r from Receipt r where (:manager is null or r.manager=:manager) and r.code=:code")
    Receipt findByCodeAndManager(@Param("code") String code,@Param("manager") String manager);
    public List<Receipt> findByReceiptGroup(ReceiptGroup receiptGroup);

    List<Receipt> findByProvider(Provider p);
}
