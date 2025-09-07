package lk.Laknaw_Bookshop.purchaseorder;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer> {

    @Query(value = "SELECT CONCAT('PO', LPAD(COALESCE(CAST(SUBSTRING(MAX(p.order_code), 3) AS UNSIGNED), 0) + 1, 3, '0')) FROM laknaw_bookshop.purchase_order AS p", nativeQuery = true)
    String getNextOrderCodeNumber();

    @Query(value = "SELECT * FROM laknaw_bookshop.purchase_order as po where po.order_code=?1;", nativeQuery = true)
    BigDecimal getByAmountOrderCode(String ordercode);

    @Query(value = "SELECT * FROM laknaw_bookshop.purchase_order as po where po.purchaseorder_status_id<>2", nativeQuery = true)
    List<PurchaseOrder> getByPurchaseOrderStatus();

}
