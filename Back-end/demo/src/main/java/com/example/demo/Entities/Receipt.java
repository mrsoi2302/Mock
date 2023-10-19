package com.example.demo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = " receipts")
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Timestamp created_date;
    @Column(nullable = false,unique = true)
    private String code;
    @NotNull
    private long revenue;
    @NotNull
    private String submitter="s";
    @ManyToOne
    @JoinColumn(name = "providers_id")
    private Provider provider;
    @ManyToOne
    @JoinColumn(name="receipt_types_id")
    private ReceiptType receiptType;

    public void setReceipt(Receipt receipt) {
        this.code = receipt.code;
        this.revenue = receipt.revenue;
        this.submitter = receipt.submitter;
        this.provider = receipt.provider;
        this.receiptType = receipt.receiptType;

    }
}
