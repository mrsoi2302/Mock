package com.example.demo.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "payment_type")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    private String name;
    @OneToMany(mappedBy = "paymentType",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Payment> payments;
    @OneToMany(mappedBy = "payment_type",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Receipt> receipts;

    public void setPaymentType(PaymentType paymentType) {
        this.name = paymentType.getName();
        this.payments = paymentType.getPayments();
    }
}
