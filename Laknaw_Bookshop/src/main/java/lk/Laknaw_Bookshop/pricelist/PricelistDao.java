package lk.Laknaw_Bookshop.pricelist;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PricelistDao extends JpaRepository<PriceList, Integer> {

    @Query(value = "SELECT * FROM laknaw_bookshop.pricelist as pl where pl.supplier_id=?1 and pl.deadline_date>?2", nativeQuery = true)
    List<PriceList> getBySupplierAnddate(Integer supplierid, String requireddate);

    @Query(value = "SELECT CONCAT('PL', LPAD(COALESCE(CAST(SUBSTRING(MAX(p.pricelist_no), 3) AS UNSIGNED), 0) + 1, 3, '0')) FROM laknaw_bookshop.pricelist AS p", nativeQuery = true)
    String getNextPriceListNumber();

    @Query(value = "SELECT * FROM laknaw_bookshop.pricelist as p where p.deadline_date<current_date() and p.pricelist_status_id<>2", nativeQuery = true)
    List<PriceList> getBydeadline();

}
