package lk.Laknaw_Bookshop.inventory;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

public class InventoryStatusController {

    @Autowired
    private InventoryStatusDao inventorystatusdao;

    @GetMapping(value = "/inventorystatus/alldata", produces = "application/json")
    public List<InventoryStatus> getAllData() {
        return inventorystatusdao.findAll();
    }
}
