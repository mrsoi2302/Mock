package com.example.demo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "providers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    private String code;
    @NotNull
    private String name;
    @NotNull
    private String contact;
    private Date created_date;
    private Date modified_date;
    @Column(columnDefinition = "bigint default 0")
    private long debt;
    @Column(columnDefinition = "bigint default 0")
    private long total;
    @ManyToOne
    @JoinColumn(name = "status_id")
    private Status status;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "employees_has_providers",
            joinColumns = @JoinColumn(name = "providers_id"),
            inverseJoinColumns = @JoinColumn(name = "employees_id")
    )
    private Set<Employee> employees;
    @OneToMany(mappedBy = "provider",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Receipt> receipts;

    public void setProvider(Provider provider) {
        this.code = provider.code;
        this.name = provider.name;
        this.contact = provider.contact;
        this.created_date = provider.created_date;
        this.modified_date = provider.modified_date;
        this.debt = provider.debt;
        this.status = provider.status;
        this.employees = provider.employees;
    }
}
