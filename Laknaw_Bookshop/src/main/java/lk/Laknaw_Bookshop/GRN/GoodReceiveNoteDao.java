package lk.Laknaw_Bookshop.GRN;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GoodReceiveNoteDao extends JpaRepository<GoodReceiveNote, Integer> {

    @Query("SELECT g FROM GoodReceiveNote g WHERE g.purchaseOrder_id.supplier_id.id =?1 and g.net_amount<>g.paid_amount")
    List<GoodReceiveNote> getBySupplier(Integer supplierid);

    @Query(value = "SELECT CONCAT('G', LPAD(COALESCE(CAST(SUBSTRING(MAX(g.grn_code), 3) AS UNSIGNED), 0) + 1, 3, '0')) FROM laknaw_bookshop.grn AS g", nativeQuery = true)
    String getNextGRNCodeNumber();

}
