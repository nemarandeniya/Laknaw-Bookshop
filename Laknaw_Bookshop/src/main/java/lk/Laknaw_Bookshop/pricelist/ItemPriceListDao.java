package lk.Laknaw_Bookshop.pricelist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ItemPriceListDao extends JpaRepository<ItemPriceList, Integer> {

    @Query(value = "SELECT * FROM laknaw_bookshop.itemprice_list as pl where pl.item_id=?1 and pl.pricelist_id=?2", nativeQuery = true)
    ItemPriceList getByItem(Integer itemid, Integer pricelistid);
}
