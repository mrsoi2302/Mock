package com.example.demo.Entities;

import jakarta.persistence.*;
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
    private Timestamp created_date1;
    private String manager;
    private String manager_code;
    private String status;
    private String customer_name;
    @Column(nullable = false,unique = true)
    private String code;
    @NotNull
    private long paid;
    @ManyToOne
    @JoinColumn(name = "customer_id",referencedColumnName = "id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name="payment_types_id")
    private PaymentType paymentType;
    @ManyToOne
    @JoinColumn(name="payment_group_id")
    private PaymentGroup paymentGroup;

    public void setPayment(Payment payment) {
        this.paid = payment.paid;
        this.customer = payment.customer;
        this.paymentType = payment.paymentType;
        this.manager=payment.manager;
        this.manager_code=payment.manager_code;
        this.status=payment.status;
        this.paymentGroup=payment.paymentGroup;
    }
}
