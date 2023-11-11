package com.example.demo.Repositories.SequenceRepo;

import com.example.demo.Entities.SequenceGenerator;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SequenceRowMapper implements RowMapper<SequenceGenerator> {
    @Override
    public SequenceGenerator mapRow(ResultSet rs, int rowNum) throws SQLException {
        SequenceGenerator sequenceGenerator=new SequenceGenerator();
        sequenceGenerator.setId(rs.getLong("id"));
        sequenceGenerator.setX(rs.getInt("x"));
        return sequenceGenerator;
    }
}
