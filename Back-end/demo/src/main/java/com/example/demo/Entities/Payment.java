package com.example.demo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Timestamp created_date;
    @Column(nullable = false,unique = true)
    private String code;
    @NotNull
    private long paid;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name="payment_types_id")
    private PaymentType paymentType;

    public void setPayment(Payment payment) {
        this.code = payment.code;
        this.paid = payment.paid;
        this.customer = payment.customer;
        this.paymentType = payment.paymentType;
    }
}
