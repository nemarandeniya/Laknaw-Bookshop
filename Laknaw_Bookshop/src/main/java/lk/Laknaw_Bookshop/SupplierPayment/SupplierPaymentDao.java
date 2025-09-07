package lk.Laknaw_Bookshop.SupplierPayment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer> {

    @Query(value = "SELECT CONCAT('B', LPAD(COALESCE(CAST(SUBSTRING(MAX(sp.bill_no), 3) AS UNSIGNED), 0) + 1, 3, '0')) FROM laknaw_bookshop.supplier_payment AS sp", nativeQuery = true)
    String getNextBillumber();

}
