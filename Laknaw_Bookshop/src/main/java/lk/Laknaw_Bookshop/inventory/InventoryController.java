package lk.Laknaw_Bookshop.inventory;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.privilege.PrivilegeController;

@RestController
public class InventoryController {

    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private InventoryDao inventorydao;

    @RequestMapping(value = "/inventory")
    public ModelAndView inventoryUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView inventoryView = new ModelAndView();
        inventoryView.addObject("logusername", auth.getName());
        inventoryView.addObject("title", "Inventory Management");
        inventoryView.setViewName("inventory.html");
        return inventoryView;
    }

    @GetMapping(value = "/inventory/alldata", produces = "application/json")
    public List<Inventory> allInventoryData() {

        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Inventory");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return inventorydao.getAllData();
    }

    @GetMapping(value = "/inventory/listByItem/{itemid}", produces = "application/json")
    public List<Inventory> getAllInventoryByItem(@PathVariable("itemid") Integer itemid) {
        return inventorydao.getInventoryByItem(itemid);
    }
}
