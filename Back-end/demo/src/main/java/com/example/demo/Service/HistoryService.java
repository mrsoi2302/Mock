package com.example.demo.Service;

import com.example.demo.Entities.History;
import com.example.demo.Repositories.HistoryRepo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@AllArgsConstructor
@Service
public class HistoryService {
    private final HistoryRepo historyRepo;
    public void save(History history) {
        historyRepo.save(history);
    }
    @Query("")
    public List<History> listAll(Timestamp t, Pageable pageable) {
        return historyRepo.listAll(t,pageable);
    }
}
