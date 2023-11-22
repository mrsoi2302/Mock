package com.example.demo.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "receipt_group")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReceiptGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String code;
    @NotNull
    @Column(unique = true)
    private String name;
    @JsonIgnore
    @OneToMany(mappedBy = "receiptGroup",cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Receipt> receipts;
}
