package lk.Laknaw_Bookshop.purchaseorder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PurchaseOrderStatusContoller {

    @Autowired
    private PurchaseOrderStatusDao purchaseorderstatusdao;

    @GetMapping(value = "/purchaseorderstatus/alldata", produces = "application/json")
    public List<PurchaseOrderStatus> allPurchaseOrderStatusList() {
        return purchaseorderstatusdao.findAll();
    }
}
