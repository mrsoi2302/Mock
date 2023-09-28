package com.example.demo.Repositories;

import com.example.demo.Entities.History;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface HistoryRepo extends JpaRepository<History,Long> {
    @Query("select h from History h where " +
            ":value is null or h.time=:value"
    )
    List<History> listAll(@Param("value") Timestamp t, Pageable pageable);
}
