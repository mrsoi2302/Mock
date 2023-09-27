package com.example.demo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "receipt_types")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotNull
    private String name;
    @OneToMany(mappedBy = "receiptType",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Receipt> receipts;
    void setReceiptType(ReceiptType receiptType){
        this.name=receiptType.name;
        this.receipts=receiptType.getReceipts();
    }
}
