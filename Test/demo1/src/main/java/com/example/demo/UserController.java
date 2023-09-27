package com.example.demo;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@AllArgsConstructor
public class UserController {
    private UserRepo userRepo;
    @GetMapping("/find")
    public List<User> findAll(@RequestBody User user, @RequestParam int page){
        return userRepo.listAll(user.getUsername(),user.getPassword(), PageRequest.of(page,1));
    }
    @PutMapping
    public String update(@RequestBody User user){
        User temp=userRepo.findByUsername(user.getUsername());
        temp.setUser(user);
        userRepo.save(temp);
        return "OK";
    }
}
