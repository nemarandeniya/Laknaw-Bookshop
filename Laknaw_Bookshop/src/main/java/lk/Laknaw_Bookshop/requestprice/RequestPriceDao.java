package lk.Laknaw_Bookshop.requestprice;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RequestPriceDao extends JpaRepository<RequestPrice, Integer> {

    @Query(value = "SELECT * FROM laknaw_bookshop.request_price", nativeQuery = true)
    List<RequestPrice> getReqNo();

    @Query(value = "SELECT CONCAT('RP', LPAD(COALESCE(CAST(SUBSTRING(MAX(r.request_no), 3) AS UNSIGNED), 0) + 1, 3, '0')) FROM laknaw_bookshop.request_price AS r", nativeQuery = true)
    String getReqPriceNumber();

    // ststus eka complete nati ewa and required date eka panapu nati ewa thorala
    // requred date anuwa order krnwa
    @Query(value = "SELECT * FROM laknaw_bookshop.request_price as rp where rp.supplier_id =?1 and rp.request_price_status_id<>2 and rp.required_date>current_date() ORDER BY rp.required_date DESC", nativeQuery = true)
    List<RequestPrice> getBySupplier(Integer supplierid);

}
