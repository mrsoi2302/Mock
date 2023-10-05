package com.example.demo.Controllers;

import com.example.demo.DataType.Value;
import com.example.demo.Entities.History;
import com.example.demo.Service.HistoryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/admin/history")
public class HistoryController {
    private HistoryService historyService;
    @PostMapping("/show")
    List<History> show(@RequestBody Value<String> value, @RequestParam int page){
        System.out.println(value.getValue());
        return historyService.listAll(null, PageRequest.of(page,10));
    }
    @GetMapping("/number")
    long number(){
        return historyService.count();
    }
}
