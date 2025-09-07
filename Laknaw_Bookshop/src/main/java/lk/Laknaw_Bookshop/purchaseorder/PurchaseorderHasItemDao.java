package lk.Laknaw_Bookshop.purchaseorder;

// import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PurchaseorderHasItemDao extends JpaRepository<PurchaseOrderHasItem, Integer> {

    // @Query(value = "SELECT * FROM laknaw_bookshop.order_item_list as phi where
    // phi.item_id= ?1 ", nativeQuery = true)
    // List<PurchaseOrderHasItem> getByItem(Integer itemid);

    @Query(value = "SELECT * FROM laknaw_bookshop.order_item_list as phi where phi.purchase_order_id= ?1 and phi.item_id=?2", nativeQuery = true)
    PurchaseOrderHasItem getByItem(Integer purchaseorderid, Integer itemid);

}
