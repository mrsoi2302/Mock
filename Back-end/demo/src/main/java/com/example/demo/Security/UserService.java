package com.example.demo.Security;

import com.example.demo.Entities.Employee;
import com.example.demo.Repositories.EmployeeRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private EmployeeRepo employeeRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Employee employee=employeeRepo.findByUsername(username);
        if(employee==null) throw new UsernameNotFoundException(username);
        return employee;
    }
}
