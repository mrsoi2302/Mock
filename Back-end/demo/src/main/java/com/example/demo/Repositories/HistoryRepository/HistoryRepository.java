package com.example.demo.Repositories.HistoryRepository;

import com.example.demo.Entities.History;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@AllArgsConstructor
public class HistoryRepository {
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    public List<History> historyList(Date date, String code, String name, int page, int limit, String sortOrder,String sortBy){
        String sql="SELECT * FROM history  where (:date is null or (DAY(history.time2)=DAY(:date) AND MONTH(history.time2)=MONTH(:date) AND YEAR(history.time2)=YEAR(:date))) " +
                "and (:code is null or history.employee_code = :code) " +
                "and (:name is null or history.name=:name) ORDER BY "+sortBy+" "+sortOrder+" LIMIT :limit OFFSET :page ";
        Map<String,Object> param=new HashMap<>();
        param.put("date",date);
        param.put("code",code);
        param.put("name",name);
        param.put("limit",limit);
        param.put("page",page);
        return namedParameterJdbcTemplate.query(sql,param,new HistoryRowMapper());
    }
    public Long countList(Date date,String code,String name){
        String sql="SELECT COUNT(*) FROM history where(:date is null or cast(history.time2 as date)=:date ) " +
                "and (:code is null or history.employee_code = :code) " +
                "and (:name is null or history.name=:name)";
        Map<String,Object> param=new HashMap<>();
        param.put("date",date);
        param.put("code",code);
        param.put("name",name);
        return namedParameterJdbcTemplate.queryForObject(sql,param, Long.class);
    }
    public void save(String code, String name, String msg){
        Timestamp time2=new Timestamp(System.currentTimeMillis());
        Timestamp time= new Timestamp(System.currentTimeMillis()+(1000*60*60*7));
        String sql="INSERT INTO history (name,employee_code,time,time2,msg) " +
                "VALUES (:name,:code,:time,:time2,:msg);";
        Map<String,Object> param=new HashMap<>();
        param.put("name",name);
        param.put("code",code);
        param.put("time",time);
        param.put("time2",time2);
        param.put("msg",msg);
        namedParameterJdbcTemplate.update(sql,param);
    }
}
