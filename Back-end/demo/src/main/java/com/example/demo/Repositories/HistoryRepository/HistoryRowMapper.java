package com.example.demo.Repositories.HistoryRepository;

import com.example.demo.Entities.History;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class HistoryRowMapper implements RowMapper<History> {
    @Override
    public History mapRow(ResultSet rs, int rowNum) throws SQLException {
        History history=new History();
        history.setId(rs.getLong("id"));
        history.setName(rs.getString("name"));
        history.setEmployee_code(rs.getString("employee_code"));
        history.setMsg(rs.getString("msg"));
        history.setTime(rs.getTimestamp("time"));
        history.setTime2(rs.getTimestamp("time2"));
        return history;
    }
}
