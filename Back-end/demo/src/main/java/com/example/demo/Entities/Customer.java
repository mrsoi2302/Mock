package com.example.demo.Entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
import java.util.List;
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
    @NotNull
    private String name;
    @NotNull
    private String contact;
    @NotNull
    private String gender;
    @Column(columnDefinition = "bigint default 0")
    private long total;
    private Date created_date;
    private Date created_date1;
    private Date modified_date;
    private Date birthday;
    private String status;
    private String manager;
    private String manager_code;
    private int birthday_year;
    private int birthday_month;
    private int birthday_day;
    @Email
    private String email;
    @ManyToOne
    @JoinColumn(name = "customer_type_id",referencedColumnName = "id")
    private CustomerType customer_type;
    @JsonIgnore
    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Payment> payments;
    public void setPayments(Set<Payment> payments){
        payments.addAll(payments);
    }
    public void setCustomer(Customer customer) {
        this.name =customer.name;
        this.contact =customer.contact;
        this.gender =customer.gender;
        this.birthday=customer.birthday;
        this.customer_type =customer.customer_type;
        this.email=customer.email;
        this.manager=customer.manager;
        this.manager_code=customer.manager_code;
        this.status=customer.status;
    }

}
