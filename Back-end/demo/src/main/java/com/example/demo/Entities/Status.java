package com.example.demo.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "status")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    String name;
    @OneToMany(mappedBy = "status",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Customer> customers;

    public void setStatus(Status status) {
        this.name = status.name;
        this.customers = status.customers;
    }
}
