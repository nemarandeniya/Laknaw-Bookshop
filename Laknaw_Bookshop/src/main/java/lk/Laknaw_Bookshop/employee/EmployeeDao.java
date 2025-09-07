package lk.Laknaw_Bookshop.employee;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    // display employee based on their nic
    @Query("select e from Employee e where e.nic=?1")
    Employee getByNic(String nic);

    // display employee based on their calling name
    @Query("select e from Employee e where e.callingname=?1")
    Employee getByCallingName(String callingname);

    // display employee based on their email adress
    @Query("select e from Employee e where e.email=?1")
    Employee getByEmail(String email);

    // generate next employee number in 3 digit format
    // @Query(value = "SELECT lpad(max(e.empnum)+1,3,0) FROM
    // laknaw_bookshop.employee as e;", nativeQuery = true)
    @Query(value = "SELECT CONCAT('E', LPAD(COALESCE(CAST(SUBSTRING(MAX(e.empnum), 3) AS UNSIGNED), 0) + 1, 3, '0')) FROM laknaw_bookshop.employee AS e", nativeQuery = true)
    String getNextEmployeeNumber();// LPAD(string, length, number ekta issrhin ena anke ex; 0)

    // display employee without user account
    @Query("select e from Employee e where e.id not in(SELECT u.employee_id.id from User u)")
    List<Employee> getListByWithOutUserAccount();

    @Query(value = "SELECT COUNT(e.empnum) FROM laknaw_bookshop.employee AS e WHERE e.employee_status_id<>3", nativeQuery = true)
    Long currentEmployeeCount();
}
