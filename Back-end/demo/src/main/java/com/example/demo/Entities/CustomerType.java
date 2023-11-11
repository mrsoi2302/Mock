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
    private String content;
    @Column(nullable = false,unique = true)
    private String code;
    @OneToMany(mappedBy ="customer_type",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Customer> customers;

}
