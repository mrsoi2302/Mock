package com.example.demo.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "providers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    @NotNull
    private String name;
    @NotNull
    private String contact;
    private Date created_date;
    private Date created_date1;
    private Date modified_date;
    @Column(columnDefinition = "bigint default 0")
    private long debt;
    @Column(columnDefinition = "bigint default 0")
    private long total;
    private String status;
    private String manager;
    private String manager_code;
    private String email;
    private boolean state;
    @JsonIgnore
    @OneToMany(mappedBy = "provider",cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH},fetch = FetchType.LAZY)
    private Set<Receipt> receipts;
    @ManyToOne
    @JoinColumn(name = "provider_type_id",referencedColumnName = "id")
    private ProviderType provider_type;

    public void setProvider(Provider provider) {
        this.name = provider.name;
        this.contact = provider.contact;
        this.modified_date = provider.modified_date;
        this.debt = provider.debt;
        this.status = provider.status;
        this.email=provider.email;
        this.manager=provider.manager;
        this.manager_code=provider.manager_code;
        this.state=provider.isState();
    }
}
