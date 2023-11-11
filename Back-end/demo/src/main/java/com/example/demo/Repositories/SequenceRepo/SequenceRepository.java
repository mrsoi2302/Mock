package com.example.demo.Repositories.SequenceRepo;

import com.example.demo.Entities.SequenceGenerator;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@AllArgsConstructor
public class SequenceRepository {
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    public String generate(){
        String sql="select id from sequence order by id desc limit 1";
        insert();
        Map<String,Object> param=new HashMap<>();
        return namedParameterJdbcTemplate.queryForObject(sql,param,String.class);
    }
    private void insert(){
        String sql="insert into sequence (x) values(:x)";
        int x=1;
        Map<String,Object> param=new HashMap<>();
        param.put("x",x);
        namedParameterJdbcTemplate.update(sql,param);
    }
}
