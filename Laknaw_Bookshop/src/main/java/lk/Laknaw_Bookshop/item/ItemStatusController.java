package lk.Laknaw_Bookshop.item;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ItemStatusController {

    @Autowired
    private ItemStatusDao itemstatusdao;

    @GetMapping(value = "/itemstatus/alldata", produces = "application/json")
    public List<ItemStatus> allItemStatusList() {
        return itemstatusdao.findAll();
    }
}
