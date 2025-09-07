package lk.Laknaw_Bookshop.item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ItemDao extends JpaRepository<Item, Integer> {

    // @Query(value = "SELECT lpad(max(i.itemcode)+1,3,0) FROM laknaw_bookshop.item
    // as i;", nativeQuery = true)
    // String getNextItemNumber();

    // define query for get item by given supplier
    @Query(value = "select i from Item i where i.id in(select shi.item_id.id from SupplierHasItem shi where shi.supplier_id.id=?1)")
    List<Item> getBySupplier(Integer supplierid);

    @Query(value = "select i from Item i where i.category_id.id =?1 and i.brand_id.id=?2")
    List<Item> getByCategoryAndBrand(Integer categoryId, Integer brandId);
    // uda query eka 1,2 kiyala danne natuwa parameter widihata danwnm enne mehema
    // @Query("SELECT i FROM Item i WHERE i.category_id.id = :categoryId AND
    // i.brand_id.id = :brandId")
    // List<Item> getByCategoryAndBrand(@Param("categoryId") Integer categoryId,
    // @Param("brandId") Integer brandId);

    @Query(value = "select i from Item i where i.id in(select phi.item_id.id from PurchaseOrderHasItem phi where phi.purchaseOrder_id.id=?1)")
    List<Item> getByPorder(Integer porderid);

    @Query(value = "select i from Item i where i.id in(select ipl.item_id.id from ItemPriceList ipl where ipl.pricelist_id.id=?1)")
    List<Item> getByPriceList(Integer pricelistid);

    @Query(value = "SELECT * FROM laknaw_bookshop.item as i where i.subcategory_id=?1", nativeQuery = true)
    List<Item> getBySubCategory(Integer subcategoryid);

    @Query(value = "SELECT * FROM laknaw_bookshop.item as i join laknaw_bookshop.request_price_has_item as rpi on i.id= rpi.item_id where rpi.request_price_id =?1", nativeQuery = true)
    List<Item> getByReqPrice(Integer requestpriceid);

    // inventory eke item eke quantity eka rop ekta wda ewa list krnw
    @Query(value = "SELECT i.* FROM laknaw_bookshop.item as i join laknaw_bookshop.inventory as inv on i.id= inv.item_id where inv.available_qty<= i.rop;", nativeQuery = true)
    List<Item> getAvalableItemQty();

}
