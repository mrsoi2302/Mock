package com.example.demo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "receipts")
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Timestamp created_date1;
    private String status;
    private String manager;
    private String manager_code;
    private Timestamp created_date;
    private String code;
    private String provider_name;
    @NotNull
    private long revenue;
    @ManyToOne
    @JoinColumn(name = "providers_id",referencedColumnName = "id")
    private Provider provider;
    @ManyToOne
    @JoinColumn(name="payment_types_id")
    private PaymentType payment_type;
    @ManyToOne
    @JoinColumn(name="receipt_group_id",referencedColumnName = "id")
    private ReceiptGroup receiptGroup;
    public void setReceipt(Receipt receipt) {
        this.payment_type=receipt.payment_type;
        this.revenue = receipt.revenue;
        this.provider = receipt.provider;
        this.manager=receipt.manager;
        this.manager_code=receipt.manager_code;
        this.status=receipt.status;
    }
}
