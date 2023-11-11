package com.example.demo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String name;
    private String contact;
    private String gender;
    @Column(columnDefinition = "bigint default 0")
    private long total;
    private Date created_date;
    private Date created_date1;
    private Date modified_date;
    private int birthday_day;
    private int birthday_month;
    private String status;
    private String manager;
    private String manager_code;
    @Email
    private String email;
    private int birthday_year;
    @ManyToOne
    @JoinColumn(name="customer_types_id")
    private CustomerType customer_type;
    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Payment> payments;
    public void setPayments(Set<Payment> payments){
        payments.addAll(payments);
    }
    public void setCustomer(Customer customer) {
        this.name =customer.name;
        this.contact =customer.contact;
        this.gender =customer.gender;
        this.birthday_day =customer.birthday_day;
        this.birthday_month =customer.birthday_month;
        this.birthday_year =customer.birthday_year;
        this.customer_type =customer.customer_type;
        this.email=customer.email;
        this.manager=customer.manager;
        this.manager_code=customer.manager_code;
    }
}
