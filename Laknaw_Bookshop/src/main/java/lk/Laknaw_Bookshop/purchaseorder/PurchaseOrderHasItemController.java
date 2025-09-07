package lk.Laknaw_Bookshop.purchaseorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PurchaseOrderHasItemController {

    @Autowired
    private PurchaseorderHasItemDao purchaseorderHasItemDao;

    @GetMapping(value = "/purchaseorderhasitem/alldata/{purchaseorderid}/{itemid}", produces = "application/json")
    public PurchaseOrderHasItem getAllDataByItem(@PathVariable("purchaseorderid") String purchaseorderid,
            @PathVariable("itemid") String itemid) {
        return purchaseorderHasItemDao.getByItem(Integer.parseInt(purchaseorderid), Integer.parseInt(itemid));
    }

    // @GetMapping(value = "/purchaseorderhasitem/alldata", produces =
    // "application/json")
    // public List<PurchaseOrderHasItem> getAllData() {
    // return purchaseorderHasItemDao.findAll();
    // }
}
