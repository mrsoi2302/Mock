package com.example.demo.Controller;

import com.example.demo.Entities.History;
import com.example.demo.Repositories.HistoryRepository.HistoryRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/history")
@AllArgsConstructor
@Transactional
public class HistoryController {
    private final HistoryRepository historyRepository;
    @PostMapping("/list")
    public List<History> historyList(@RequestBody History history,
                                     @RequestParam(name = "page") int page,
                                     @RequestParam (name = "limit")int limit,
                                     @RequestParam(name = "sort",defaultValue = "time-desc",required = false) String sort){
        String[] sortParams = sort.split("-");
        sortParams[1]=sortParams[1].equals("ascend")? "asc":"desc";
        System.out.println(history.getTime());
        return historyRepository.historyList(history.getTime(),history.getEmployee_code(),history.getName(),page*limit,limit,sortParams[1],sortParams[0]);
    }
    @PostMapping("/count")
    public Long countList(@RequestBody History history){
        return historyRepository.countList(history.getTime(),history.getEmployee_code(),history.getName());
    }
}
