package com.example.demo.Repositories;

import com.example.demo.DataType.EmployeeDTO;
import com.example.demo.Entities.Employee;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee,Long> {
    Employee findByUsername(String username);

    Employee findByUsernameAndPassword(@Param("name") String username, @Param("password") String password);

    @Query("select e from Employee e where " +
            "(:value is null or " +
            "(e.code like concat('%',:value,'%') )" +
            "or" +
            "(e.name like concat('%',:value,'%') ))" +
            "and" +
            "(:role is null or e.role=:role)" +
            "and" +
            "(e.role!='ADMIN')")
    List<EmployeeDTO> list(@Param("value") String value,
                        @Param("role") String role,
                        Pageable pageable);
    @Query("select count(e) from Employee e where " +
            "(:value is null or " +
            "(e.code like concat('%',:value,'%') )" +
            "or" +
            "(e.name like concat('%',:value,'%') ))" +
            "and" +
            "(:role is null or e.role=:role)" +
            "and" +
            "(e.role!='ADMIN')")
    Long countList(@Param("value") String value,
                   @Param("role") String role);
    @Query("select e from Employee e where e.code=:code and e.role!='ADMIN'")
    Employee findByCode(String code);
    @Query("select e from Employee e where e.code=:code and e.role!='ADMIN'")
    EmployeeDTO findByCodeDTO(String code);

    void deleteByCode(String code);
    @Modifying
    @Query("delete from Employee e where e.code in :list")
    void delete(@Param("list") List<String> list);
    @Query("SELECT e from Employee e where e.role!='USER'")
    List<EmployeeDTO> list();
}
