package lk.Laknaw_Bookshop.pricelist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ItemPriceListController {

    @Autowired
    private ItemPriceListDao itempricelistdao;

    @GetMapping(value = "/itempricelist/listByItemAndPriceList/{itemid}/{pricelistid}", produces = "application/json")
    public ItemPriceList getAllDataByItem(@PathVariable("itemid") String itemid,
            @PathVariable("pricelistid") String pricelistid) {
        return itempricelistdao.getByItem(Integer.parseInt(itemid), Integer.parseInt(pricelistid));
    }
}
