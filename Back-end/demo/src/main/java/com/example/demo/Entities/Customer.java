package com.example.demo.Entities;

import jakarta.persistence.*;
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
    @Column(nullable = false,unique = true)
    private String code;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String contact;
    @NotNull
    private String gender;
    @Column(columnDefinition = "bigint default 0")
    private long debt;
    @Column(columnDefinition = "bigint default 0")
    private long target;
    @Column(columnDefinition = "bigint default 0")
    private long total;
    private Date created_date;
    private Date created_date1;
    private Date modified_date;
    private int birthday_day;
    private int birthday_month;
    private int birthday_year;
    @ManyToOne
    @JoinColumn(name="customer_types_id")
    private CustomerType customerType;
    @ManyToOne
    @JoinColumn(name="status_id")
    private Status status;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "employees_has_customers",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name="employee_id")
    )
    private Set<Employee> employees;
    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Payment> payments;
    public void setPayments(Set<Payment> payments){
        payments.addAll(payments);
    }
    public void setCustomer(Customer customer) {
        this.name =customer.name;
        this.contact =customer.contact;
        this.gender =customer.gender;
        this.target =customer.target;
        this.birthday_day =customer.birthday_day;
        this.birthday_month =customer.birthday_month;
        this.birthday_year =customer.birthday_year;
        this.customerType =customer.customerType;
        this.status =customer.status;
    }
}
