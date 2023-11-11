package com.example.demo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = " receipts")
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Timestamp created_date1;
    private String status;
    private String manager;
    private String manager_code;
    private Timestamp created_date;
    @Column(nullable = false,unique = true)
    private String code;
    @NotNull
    private long revenue;
    @ManyToOne
    @JoinColumn(name = "providers_id")
    private Provider provider;
    @ManyToOne
    @JoinColumn(name="payment_types_id")
    private PaymentType payment_type;


    public void setReceipt(Receipt receipt) {
        this.payment_type=receipt.payment_type;
        this.revenue = receipt.revenue;
        this.provider = receipt.provider;
        this.manager=receipt.manager;
        this.manager_code=receipt.manager_code;
    }
}
