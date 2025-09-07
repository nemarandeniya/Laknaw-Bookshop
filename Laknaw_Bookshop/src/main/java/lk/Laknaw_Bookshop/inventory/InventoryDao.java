package lk.Laknaw_Bookshop.inventory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.Laknaw_Bookshop.item.Item;

public interface InventoryDao extends JpaRepository<Inventory, Integer> {

    @Query(value = "SELECT * FROM laknaw_bookshop.inventory as iv where iv.item_id=?1", nativeQuery = true)
    List<Inventory> getInventoryByItem(Integer itemid);

    @Query(value = "select i from Inventory i where i.item_id=?1")
    Inventory getByItemId(Item item);

    @Query(value = "SELECT * FROM laknaw_bookshop.inventory order by id desc;", nativeQuery = true)
    List<Inventory> getAllData();

}
