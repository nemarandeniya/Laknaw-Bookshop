package lk.Laknaw_Bookshop.Invoice;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InvoiceDao extends JpaRepository<Invoice, Integer> {

    @Query(value = "SELECT CONCAT('INV-', LPAD(COALESCE(CAST(SUBSTRING(MAX(i.invoice_number), 5) AS UNSIGNED), 0) + 1, 3, '0')) FROM laknaw_bookshop.invoice AS i", nativeQuery = true)
    String getNextInvoiceNumber();

    @Query(value = "SELECT COUNT(c.invoice_number) FROM laknaw_bookshop.invoice AS c WHERE MONTH(c.invoice_date) = MONTH(CURRENT_DATE()) AND YEAR(c.invoice_date) = YEAR(CURRENT_DATE());", nativeQuery = true)
    Long getInvoiceCountForMonth();

    @Query(value = "SELECT * FROM laknaw_bookshop.invoice order by id desc;", nativeQuery = true)
    List<Invoice> getAllData();

    @Query(value = "SELECT COUNT(c.invoice_number) FROM laknaw_bookshop.invoice AS c WHERE date(c.invoice_date) = date(CURRENT_DATE());", nativeQuery = true)
    Long getInvoiceCountForToday();

}
