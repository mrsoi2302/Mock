package com.example.demo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Data
@Entity
@AllArgsConstructor
@Table(name="employees")
@ToString
@NoArgsConstructor
public class Employee implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    private String username;
    @Column(nullable=false)
    private String password;
    @NotNull
    private String name;
    @Column(unique = true,nullable = false)
    private String code;
    String role;
    @ManyToMany(mappedBy = "employees")
    private Set<Customer> customers;
    @ManyToMany(mappedBy = "employees")
    private Set<Provider> providers;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setEmployee(Employee employee) {
        this.username = employee.username;
        this.password = employee.password;
        this.name = employee.name;
        this.code = employee.code;
        this.role = employee.role;
        this.customers = employee.customers;
        this.providers = employee.providers;
    }
}
