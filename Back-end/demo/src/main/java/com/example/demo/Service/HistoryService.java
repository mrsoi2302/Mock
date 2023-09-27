package com.example.demo.Service;

import com.example.demo.Entities.History;
import com.example.demo.Repositories.HistoryRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class HistoryService {
    private final HistoryRepo historyRepo;
    public void save(History history) {
        historyRepo.save(history);
    }
}
