package com.example.demo.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "customer_types")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    private String name;
    @Column(nullable = false,unique = true)
    private String code;
    @Column(columnDefinition = "bigint default 0")
    private long member;
    private Date created_date;
    @OneToMany(mappedBy ="customerType",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Customer> customers;

    public void setCustomerType(CustomerType customerType) {
        this.name = customerType.name;
        this.code = customerType.code;
    }
}
