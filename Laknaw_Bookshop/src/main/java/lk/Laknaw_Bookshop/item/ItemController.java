package lk.Laknaw_Bookshop.item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import java.time.LocalDateTime;
import lk.Laknaw_Bookshop.privilege.PrivilegeController;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class ItemController {

    @Autowired
    private ItemDao itemdao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ItemStatusDao itemstatusdao;

    @Autowired
    private PrivilegeController privilegeController;

    @RequestMapping(value = "/item")
    public ModelAndView itemUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView itemView = new ModelAndView();
        itemView.addObject("logusername", auth.getName());
        itemView.addObject("title", "Item Management");
        itemView.setViewName("item.html");
        return itemView;
    }

    // define Get mapping for viem item record
    @GetMapping(value = "/item/alldata", produces = "application/json")
    public List<Item> getAllData() {
        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Item");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return itemdao.findAll();
    }

    // define Post mapping for save item record
    @PostMapping(value = "/item")
    public String addItem(@RequestBody Item item) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Item");

        if (!logUserPrivi.get("insert")) {
            return "Insert Not Complete : You haven't Privilege";
        }

        try {
            // set added date time
            item.setAddeddate(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            item.setAddeduser_id(loggeduser.getId());
            // set itemcode
            // String nextNumber = itemdao.getNextItemNumber();
            // if (nextNumber == null) {
            // item.setBarcode("004");
            // } else {
            // item.setBarcode(nextNumber);
            // }

            // set profit rate
            // double purchasePrice = item.getPurchaseprice();
            // double salesPrice = item.getSaleprice();
            // if (purchasePrice <= 0) {
            // return ("Purchase price must be greater than 0");
            // } else {
            // double profit = salesPrice - purchasePrice;
            // item.setProfitrate((profit / purchasePrice) * 100);
            // }

            itemdao.save(item);
            return "OK";
        } catch (Exception e) {
            return "Save not complete : " + e.getMessage();

        }

    }

    // define delete mapping for delete item record
    @DeleteMapping(value = "/item")
    public String deleteEmployee(@RequestBody Item item) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Item");
        if (!logUserPrivi.get("delete")) {
            return "Delete Not Complete : You haven't Privilege";
        }

        Item extItem = itemdao.getReferenceById(item.getId());
        if (extItem == null) {
            return "Delete not completed : item not exists";
        }
        try {

            // set delete date time
            item.setDeletedatetime(LocalDateTime.now());

            // set delete user id
            User loggeduser = userDao.getByUsername(auth.getName());
            item.setDeleteuser_id(loggeduser.getId());

            // soft delete
            ItemStatus deleteStatus = itemstatusdao.getReferenceById(4);
            extItem.setItemstatus_id(deleteStatus);
            itemdao.save(extItem);
            return "OK";
        } catch (Exception e) {
            return "Delete not completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/item")
    public String updateItem(@RequestBody Item item) {
        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Item");

        if (!logUserPrivi.get("update")) {
            return "Update Not Complete : You haven't Privilege";
        }

        // check existing
        Item extItem = itemdao.getReferenceById(item.getId());
        if (extItem == null) {
            return "Update not completed: item not available..!";
        }
        try {
            // set update date time
            item.setUpdatedatetime(LocalDateTime.now());

            // set update user id
            User loggeduser = userDao.getByUsername(auth.getName());
            item.setUpdateuser_id(loggeduser.getId());
            itemdao.save(item);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();

        }
    }

    @GetMapping(value = "/item/listByAvailable", produces = "application/json")
    public List<Item> getAvailableItemList() {
        return itemdao.findAll();
    }

    @GetMapping(value = "/item/listByAvailableQuantity", produces = "application/json")
    public List<Item> getAvailableItemQtyList() {
        return itemdao.getAvalableItemQty();
    }

    @GetMapping(value = "/item/listBySupplier/{supplierid}", produces = "application/json")
    public List<Item> getAllDataBySupplier(@PathVariable("supplierid") Integer supplierid) {
        return itemdao.getBySupplier(supplierid);
    }

    @GetMapping(value = "/item/listByReqPrice/{requestpriceid}", produces = "application/json")
    public List<Item> getAllDataByReqPrice(@PathVariable("requestpriceid") Integer requestpriceid) {
        return itemdao.getByReqPrice(requestpriceid);
    }

    @GetMapping(value = "/item/listByPorder/{porderid}", produces = "application/json")
    public List<Item> getAllDataByPorder(@PathVariable("porderid") Integer porderid) {
        return itemdao.getByPorder(porderid);
    }

    @GetMapping(value = "/item/listBypricelist/{pricelistid}", produces = "application/json")
    public List<Item> getAllDataByPriceList(@PathVariable("pricelistid") Integer pricelistid) {
        return itemdao.getByPriceList(pricelistid);
    }

    @GetMapping(value = "/item/listBysubCategory/{subcategoryid}", produces = "application/json")
    public List<Item> getAllDataBySubCategory(@PathVariable("subcategoryid") Integer subcategoryid) {
        return itemdao.getBySubCategory(subcategoryid);
    }

    @GetMapping(value = "/item/listByCategoryAndBrand", params = { "categoryid",
            "brandid" }, produces = "application/json")
    public List<Item> getItemByCategoryandBrand(@RequestParam("categoryid") Integer categoryId,
            @RequestParam("brandid") Integer brandId) {
        return itemdao.getByCategoryAndBrand(categoryId, brandId);
    }

}
