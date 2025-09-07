package lk.Laknaw_Bookshop.customer;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerDao extends JpaRepository<Customer, Integer> {

    @Query("select e from Customer e where e.email=?1")
    Customer getByEmail(String email);

    @Query(value = "SELECT CONCAT('C', LPAD(COALESCE(CAST(SUBSTRING(MAX(c.cust_number), 3) AS UNSIGNED), 0) + 1, 3, '0')) FROM laknaw_bookshop.customer AS c", nativeQuery = true)
    String getNextCustomerNumber();

    @Query(value = "SELECT c.loyalty_points FROM Customer as c where c.id=?1")
    BigDecimal getLoyaltypointById(Integer customerId);

}
