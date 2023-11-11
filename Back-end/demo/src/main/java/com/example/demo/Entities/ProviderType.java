package com.example.demo.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Table(name = "provider_types")
@AllArgsConstructor
@NoArgsConstructor
public class ProviderType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String content;
    @OneToMany(mappedBy ="provider_type",cascade = CascadeType.ALL,orphanRemoval = true)
    List<Provider> providers;
}
